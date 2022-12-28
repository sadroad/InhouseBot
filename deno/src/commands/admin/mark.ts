import { Bot, BotClient } from "../../../bot.ts";
import { Interaction, InteractionResponseTypes } from "../../../deps.ts";
import { update_command_id, update_queue_id } from "../../database/helpers.ts";
import {
  queue_channel_id,
  update_queue_message,
} from "../../inhouse/constants.ts";
import { display_queue } from "../../inhouse/mod.ts";
import { sleep } from "../../utils/helpers.ts";

export const mark = async (Bot: BotClient, interaction: Interaction) => {
  await Bot.helpers.sendPrivateInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    },
  );
  const options = interaction.data?.options;
  if (options === undefined) {
    await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
      content: "Discord failed to send data",
    });
    return;
  }
  const type = options[0].options?.[0].value as string;
  if (type === "queue") {
    if (queue_channel_id != BigInt(0)) {
      await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
        content: "Queue channel already set. Please use /unmark first",
      });
      await sleep(5000);
      await Bot.helpers.deleteOriginalInteractionResponse(interaction.token);
      return;
    }
    await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
      content: "Marked as queue channel",
    });
    await update_queue_id(interaction.channelId ?? BigInt(0));
    await update_queue_message(BigInt(0));
    await clear_channel(queue_channel_id);
    await display_queue();
  } else if (type === "command") {
    await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
      content: "Marked as command channel",
    });
    await update_command_id(interaction.channelId ?? BigInt(0));
    await Bot.helpers.deleteOriginalInteractionResponse(interaction.token);
  } else {
    await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
      content: "Invalid type",
    });
    await Bot.helpers.deleteOriginalInteractionResponse(interaction.token);
  }
};

export const clear_channel = async (channel_id: bigint) => {
  const messages = await Bot.helpers.getMessages(channel_id);
  for (const message of messages) {
    await Bot.helpers.deleteMessage(channel_id, message[0]);
  }
};
