import { BotClient } from "../../../bot.ts";
import { Interaction, InteractionResponseTypes } from "../../../deps.ts";
import { clear_queue } from "../../inhouse/mod.ts";

export const clear = async (Bot: BotClient, interaction: Interaction) => {
  await Bot.helpers.sendPrivateInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    },
  );
  clear_queue();
  await Bot.helpers.deleteOriginalInteractionResponse(interaction.token);
};
