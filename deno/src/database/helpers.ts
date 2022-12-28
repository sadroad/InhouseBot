import { Rating } from "../../deps.ts";
import { ServerInformation } from "../../generated/client/deno/index.d.ts";
import { queue_update } from "../inhouse/constants.ts";
import { DiscordID, Player } from "../types/inhouse.ts";
import { prisma } from "./mod.ts";

export const get_players = async (): Promise<[DiscordID, Player][]> => {
  const players = await prisma.player.findMany({
    include: {
      accounts: true,
    },
  });
  return players.map((player) => {
    const discord_id = player.discord_id as DiscordID;
    const rating = new Rating(player.mu, player.sigma);
    const puuids = player.accounts.map((accounts) => accounts.puuid);
    return [
      discord_id,
      { accounts: puuids, queued: [], rating: rating } as Player,
    ];
  });
};

export async function init_or_get_server_info(): Promise<ServerInformation> {
  const server_info = await prisma.serverInformation.findMany();
  if (server_info.length === 0) {
    const new_info = await prisma.serverInformation.create({
      data: {
        queue_channel: BigInt(0),
        command_channel: BigInt(0),
        top_emoji: "🦛",
        jungle_emoji: "🦧",
        middle_emoji: "🐴",
        bottom_emoji: "🐙",
        support_emoji: "🤖",
      },
    });
    return new_info;
  } else {
    return server_info[0];
  }
}

export const add_player = async (
  discord_id: DiscordID,
  player_info: Player,
) => {
  const output = [];
  for (const account of player_info.accounts) {
    output.push({
      puuid: account,
    });
  }
  await prisma.player.create({
    data: {
      discord_id: discord_id as bigint,
      mu: player_info.rating.mu,
      sigma: player_info.rating.sigma,
      accounts: {
        createMany: {
          data: output,
        },
      },
    },
  });
};

export const update_queue_id = async (queue_id: bigint) => {
  await prisma.serverInformation.updateMany({
    data: {
      queue_channel: queue_id,
    },
  });
  queue_update(queue_id);
};

export const update_command_id = async (command_id: bigint) => {
  await prisma.serverInformation.updateMany({
    data: {
      command_channel: command_id,
    },
  });
  queue_update(command_id);
};
