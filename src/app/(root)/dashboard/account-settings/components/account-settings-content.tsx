"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { client } from "@/lib/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  discord_id: string;
}

export function AccountSettingsContent({ discord_id }: Readonly<Props>) {
  const [discordId, setDiscordId] = useState(discord_id);

  const mutation = useMutation({
    mutationFn: async (discord_id: string) => {
      const response = await client.project.setDiscordID.$post({ discord_id });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Update user", {
        description: "Discord ID updated successfully",
      });
    },
  });

  return (
    <Card className="max-w-xl w-full space-y-4">
      <CardContent>
        <div className="pt-2">
          <Label>Discord ID</Label>
          <Input
            className="mt-1"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            placeholder="Enter your Discord ID"
          />
        </div>
        <p className="mt-2 text-sm">
          Don't know how to find your Discord ID?{" "}
          <Link
            href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID"
            className="text-primary hover:underline"
            target="_blank">
            Learn how to obtain it here
          </Link>
          .
        </p>
        <div className="pt-4">
          <Button
            onClick={() => mutation.mutate(discordId)}
            disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
