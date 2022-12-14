import { dotEnvConfig, RiotAPI } from "./deps.ts";

// Get the .env file that the user should have created, and get the token
const env = dotEnvConfig({ export: true, path: "./.env" });
const token = env.BOT_TOKEN || "";
const database_url = env.DATABASE_URL || "";
const riot_key = env.RGAPI_KEY;

export interface Config {
  token: string;
  botId: bigint;
  devGuildId: bigint;
  database_url: string;
  riot_api: RiotAPI;
}

export const configs = {
  /** Get token from ENV variable */
  token,
  /** Get the BotId from the token */
  botId: BigInt(atob(token.split(".")[0])),
  /** The server id where you develop your bot and want dev commands created. */
  devGuildId: BigInt(env.DEV_GUILD_ID!),
  database_url: database_url,
  riot_key: riot_key,
};
