import z from "zod";
import { db } from "@/lib/db";
import { DiscordClient } from "@/lib/discord-client";
import { NextRequest, NextResponse } from "next/server";
import { FREE_QUOTA, PRO_QUOTA } from "@/lib/constants";
import { EVENT_CATEGORY_NAME_VALIDATOR } from "@/lib/validators";

const REQUEST_VALIDATOR = z
  .object({
    category: EVENT_CATEGORY_NAME_VALIDATOR,
    fields: z
      .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
      .optional(),
    description: z.string().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  try {
    const auth_header = request.headers.get("Authorization");

    if (auth_header === null || auth_header.startsWith("Bearer ") === false) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const api_key = auth_header.split(" ")[1];

    if (api_key === undefined || api_key.trim() === "") {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { api_key },
      include: { events_categories: true },
    });

    if (user === null) {
      return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
    }

    if (user.discord_id === null) {
      return NextResponse.json(
        {
          message: "Please enter your discord ID in your account settings",
        },
        { status: 403 }
      );
    }

    const currentData = new Date();
    const currentMonth = currentData.getMonth() + 1;
    const currentYear = currentData.getFullYear();

    const quota = await db.quota.findUnique({
      where: {
        year_month_user_id: {
          year: currentYear,
          month: currentMonth,
          user_id: user.id,
        },
      },
    });

    const quota_limit =
      user.plan === "FREE"
        ? FREE_QUOTA.max_events_per_month
        : PRO_QUOTA.max_events_per_month;

    if (quota && quota.count >= quota_limit) {
      return NextResponse.json(
        {
          message:
            "Monthly quota reached. Please upgrade your plan for more events",
        },
        { status: 429 }
      );
    }

    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);

    const dm_channel = await discord.createDM(user.discord_id);

    let request_data;

    try {
      request_data = await request.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);

      return NextResponse.json(
        {
          message: "Invalid JSON request body",
        },
        { status: 400 }
      );
    }

    const validation_result = REQUEST_VALIDATOR.parse(request_data);

    const category = user.events_categories.find(
      (e) => e.name === validation_result.category
    );

    if (category === undefined) {
      return NextResponse.json(
        {
          message: `You don't have a category named "${validation_result.category}"`,
        },
        { status: 404 }
      );
    }

    const event_data = {
      title: `${category.emoji || "🔔"} ${
        category.name.charAt(0).toUpperCase() + category.name.slice(1)
      }`,
      description:
        validation_result.description ||
        `A new ${category.name} event has occurred!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validation_result.fields || {}).map(
        ([key, value]) => {
          return {
            name: key,
            value: String(value),
            inline: true,
          };
        }
      ),
    };

    const event = await db.event.create({
      data: {
        name: category.name,
        formatted_message: `${event_data.title}\n\n${event_data.description}`,
        user_id: user.id,
        fields: validation_result.fields || {},
        event_category_id: category.id,
      },
    });

    try {
      await discord.sendEmbed(dm_channel.id, event_data);

      await db.event.update({
        where: { id: event.id },
        data: { delivery_status: "DELIVERED" },
      });

      await db.quota.upsert({
        where: {
          year_month_user_id: {
            year: currentYear,
            month: currentMonth,
            user_id: user.id,
          },
        },
        update: { count: { increment: 1 } },
        create: {
          user_id: user.id,
          month: currentMonth,
          year: currentYear,
          count: 1,
        },
      });
    } catch (error) {
      await db.event.update({
        where: { id: event.id },
        data: { delivery_status: "FAILED" },
      });

      console.log(error);

      return NextResponse.json(
        {
          message: "Error processing event",
          eventId: event.id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Event processed successfully",
      event_id: event.id,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 422 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
