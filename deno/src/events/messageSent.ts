import { Bot } from "../../bot.ts";
import { queue_channel_id } from "../inhouse/constants.ts";
import log from "../utils/logger.ts";

Bot.events.messageCreate = async (_, message) => {
  if (message.channelId !== queue_channel_id) return;
  if (!message.isFromBot) {
    await Bot.helpers.deleteMessage(message.channelId, message.id);
    return;
  }
};
