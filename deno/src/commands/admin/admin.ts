import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionResponseTypes,
} from "../../../deps.ts";
import log from "../../utils/logger.ts";
import { createCommand } from "../mod.ts";
import { clear } from "./clear.ts";
import { mark } from "./mark.ts";

createCommand({
  name: "admin",
  description: "Super Secret Commands",
  type: ApplicationCommandTypes.ChatInput,
  defaultMemberPermissions: ["ADMINISTRATOR"],
  dmPermission: false,
  options: [{
    name: "clear",
    type: ApplicationCommandOptionTypes.SubCommand,
    description: "Clear the queue",
  }, {
    name: "remove",
    type: ApplicationCommandOptionTypes.SubCommand,
    description: "Remove a player from queue",
  }, {
    name: "mark",
    type: ApplicationCommandOptionTypes.SubCommand,
    description: "Mark the current channel as the queue/command channel",
    options: [{
      name: "type",
      type: ApplicationCommandOptionTypes.String,
      required: true,
      description: "Queue or Command Channel to mark",
      choices: [{
        name: "Queue",
        value: "queue",
      }, {
        name: "Command",
        value: "command",
      }],
    }],
  }, {
    name: "unmark",
    type: ApplicationCommandOptionTypes.SubCommand,
    description: "Unmark the current channel as the queue/command channel",
  }, {
    name: "emojis",
    type: ApplicationCommandOptionTypes.SubCommand,
    description: "Set the emojis for the roles",
  }],
  execute: async (Bot, interaction) => {
    switch (interaction.data?.options?.[0].name) {
      case "clear":
        await clear(Bot, interaction);
        break;
      case "remove":
        break;
      case "mark":
        await mark(Bot, interaction);
        break;
      case "unmark":
        break;
      case "emojis":
        break;
    }
  },
});
