import { Bot } from "../../bot.ts";
import { configs } from "../../configs.ts";
import {
  BigString,
  InteractionResponseTypes,
  InteractionTypes,
} from "../../deps.ts";
import { sleep } from "../utils/helpers.ts";
import log from "../utils/logger.ts";

Bot.events.interactionCreate = (_, interaction) => {
  if (!interaction.data) return;

  switch (interaction.type) {
    case InteractionTypes.ApplicationCommand:
      log.info(
        `[Application Command] ${interaction.data.name} command executed by ${interaction.user.username}#${interaction.user.discriminator}.`,
      );
      Bot.commands.get(interaction.data.name!)?.execute(Bot, interaction);
      break;
      // case InteractionTypes.MessageComponent:
      //   switch (interaction.data.customId) {
      //   }
  }
};
