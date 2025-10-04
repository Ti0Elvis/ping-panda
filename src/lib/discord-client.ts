import {
  APIEmbed,
  RESTPostAPIChannelMessageResult,
  RESTPostAPICurrentUserCreateDMChannelResult,
  Routes,
} from "discord-api-types/v10";
import { REST } from "@discordjs/rest";

export class DiscordClient {
  private rest: REST;

  constructor(token: string | undefined) {
    this.rest = new REST({ version: "10" }).setToken(token ?? "");
  }

  async createDM(recipient_id: string) {
    return this.rest.post(Routes.userChannels(), {
      body: { recipient_id },
    }) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
  }

  async sendEmbed(channel_id: string, embed: APIEmbed) {
    return this.rest.post(Routes.channelMessages(channel_id), {
      body: { embeds: [embed] },
    }) as Promise<RESTPostAPIChannelMessageResult>;
  }
}
