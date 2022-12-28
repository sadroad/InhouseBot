import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionResponseTypes,
} from "../../deps.ts";
import {
  display_queue,
  is_account_registered,
  is_player_registered,
  queue_player,
  register_player,
  summoner_name_to_puuid,
  update_duplicate_roles,
  update_number_of_players,
} from "../inhouse/mod.ts";
import log from "../utils/logger.ts";
import { createCommand } from "./mod.ts";
import { PUUID, Role } from "../types/inhouse.ts";
import { sleep } from "../utils/helpers.ts";

createCommand({
  name: "queue",
  description: "Register yourself to use the queue",
  type: ApplicationCommandTypes.ChatInput,
  dmPermission: false,
  options: [{
    required: true,
    name: "role",
    type: ApplicationCommandOptionTypes.Number,
    description: "Select your role",
    choices: [
      {
        name: "Top",
        value: Role.Top,
      },
      {
        name: "Jungle",
        value: Role.Jungle,
      },
      {
        name: "Middle",
        value: Role.Middle,
      },
      {
        name: "Bottom",
        value: Role.Bottom,
      },
      {
        name: "Support",
        value: Role.Support,
      },
    ],
  }],
  execute: async (Bot, interaction) => {
    if (!is_player_registered(interaction.user.id)) {
      await Bot.helpers.sendPrivateInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content:
              "Please register using `/register` before using this command",
          },
        },
      );
    } else {
      if (interaction.data?.options === undefined) {
        log.error("Discord failed to send data");
        return;
      }
      //TODO check results of queue
      const stuff = queue_player(
        interaction.user.id,
        interaction.data?.options[0].value as Role,
      );
      update_duplicate_roles();
      update_number_of_players();
      await display_queue();
      await Bot.helpers.sendPrivateInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: "You've been added to the queue",
          },
        },
      );
    }
    await sleep(5000);
    await Bot.helpers.deleteOriginalInteractionResponse(interaction.token);
  },
});
