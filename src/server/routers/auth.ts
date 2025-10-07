import { db } from "@/lib/db";
import { j, public_procedure } from "../jstack";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export const auth_router = j.router({
  getDatabaseSyncStatus: public_procedure.query(async ({ c }) => {
    const auth = await currentUser();

    if (auth === null) {
      return c.json({ isSynced: false });
    }

    const user = await db.user.findFirst({
      where: { external_id: auth.id },
    });

    if (user === null) {
      await db.user.create({
        data: {
          quota_limit: 100,
          external_id: auth.id,
          email: auth.emailAddresses[0].emailAddress,
        },
      });
    }

    return c.json({ isSynced: true });
  }),
});
