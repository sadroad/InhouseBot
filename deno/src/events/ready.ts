import { Bot } from "../../bot.ts";
import { clear_channel } from "../commands/admin/mark.ts";
import { queue_channel_id } from "../inhouse/constants.ts";
import { display_queue, load_players } from "../inhouse/mod.ts";
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
  await clear_channel(queue_channel_id);
  await display_queue();
  log.info("[READY] Bot is fully online.");
}
