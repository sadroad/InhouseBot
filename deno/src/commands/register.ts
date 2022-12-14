import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionResponseTypes,
} from "../../deps.ts";
import {
  is_account_registered,
  is_player_registered,
  register_player,
  summoner_name_to_puuid,
} from "../inhouse/mod.ts";
import log from "../utils/logger.ts";
import { createCommand } from "./mod.ts";
import { PUUID } from "../types/inhouse.ts";

createCommand({
  name: "register",
  description: "Register yourself to use the queue",
  type: ApplicationCommandTypes.ChatInput,
  dmPermission: false,
  options: [{
    required: true,
    name: "accounts",
    type: ApplicationCommandOptionTypes.String,
    description:
      "Please enter your accounts seperated by comma. Ex: sadroad, Drexnezod",
  }],
  execute: async (Bot, interaction) => {
    await Bot.helpers.sendPrivateInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `Checking information. Please wait.`,
        },
      },
    );
    if (is_player_registered(interaction.user.id)) {
      await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
        content: "You've already registered 🤠",
      });
      return;
    }
    const options = interaction.data?.options;
    if (options === undefined) {
      log.error("Discord failed to send data");
      return;
    }
    const accounts = (options[0].value as string ?? "").split(",").map(
      (account) => account.trim(),
    );
    const puuids: PUUID[] = [];
    for (const account of accounts) {
      const puuid = await summoner_name_to_puuid(account);
      if (puuid === "") {
        await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
          content: `${account} does not exist`,
        });
        return;
      }
      if (is_account_registered(puuid)) {
        await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
          content: `${account} is already registered`,
        });
      }
      puuids.push(puuid);
    }
    await register_player(interaction.user.id, puuids);
    await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
      content: `You've been registered 👍`,
    });
  },
});
