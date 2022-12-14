import { Bot } from "../../bot.ts";
import { load_players } from "../inhouse/mod.ts";
import log from "../utils/logger.ts";

Bot.events.ready = async (_, payload) => {
  log.info(
    `[READY] Shard ID ${payload.shardId} of ${
      Bot.gateway.lastShardId + 1
    } shards is ready!`,
  );

  if (payload.shardId === Bot.gateway.lastShardId) {
    await botFullyReady();
  }
};

// This function lets you run custom code when all your bot's shards are online.
async function botFullyReady() {
  // DO STUFF YOU WANT HERE ONCE BOT IS FULLY ONLINE.
  await load_players();
  log.info("[READY] Bot is fully online.");
}
