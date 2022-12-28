import { Embed, Rating } from "../../deps.ts";
import { configs } from "../../configs.ts";
import { PlatformId, RiotAPI } from "../../deps.ts";
import { add_player, get_players } from "../database/helpers.ts";
import {
  DiscordID,
  Game,
  GameManager,
  Player,
  PUUID,
  QueueManager,
  Role,
} from "../types/inhouse.ts";
import log from "../utils/logger.ts";
import { Bot } from "../../bot.ts";
import {
  bottom_emoji,
  jungle_emoji,
  middle_emoji,
  queue_channel_id,
  queue_message_id,
  support_emoji,
  top_emoji,
  update_queue_message,
} from "./constants.ts";

export const queue: QueueManager = {
  top: [],
  jungle: [],
  middle: [],
  bottom: [],
  support: [],
  players: new Map<DiscordID, Player>(),
  duplicate_roles: new Set<Role>(),
  number_of_queued_players: 0,
};

export const games: GameManager = {
  current_games: [],
  tentative_games: [],
};

export const load_players = async () => {
  const players = await get_players();
  players.forEach((player) => {
    queue.players.set(player[0], player[1]);
  });
};

export const is_player_registered = (discord_id: DiscordID): boolean => {
  return queue.players.has(discord_id);
};

export const is_account_registered = (account_check: PUUID): boolean => {
  for (const player of queue.players.values()) {
    for (const account in player.accounts) {
      if (account === account_check) {
        return true;
      }
    }
  }
  return false;
};

export const summoner_name_to_puuid = async (
  account: string,
): Promise<PUUID> => {
  const riot_api = new RiotAPI(configs.riot_key);
  const puuid = await riot_api.summoner.getBySummonerName({
    region: PlatformId.NA1,
    summonerName: `${account}`,
  }).then((summoner) => summoner.puuid).catch((err) => {
    log.error(err);
    return "";
  });
  return puuid;
};

export const register_player = async (
  discord_id: DiscordID,
  accounts: PUUID[],
) => {
  const player_data = {
    queued: [],
    rating: new Rating(),
    accounts: accounts,
  };
  queue.players.set(discord_id, player_data);
  await add_player(discord_id, player_data);
};

export const queue_player = (
  discord_id: DiscordID,
  role: Role,
): [boolean, string] => {
  const player = queue.players.get(discord_id);
  if (player === undefined) {
    return [false, "Player is not registered"];
  }
  if (
    games.current_games.some((game) =>
      players_from_game(game).includes(discord_id)
    ) || games.tentative_games.some((game) =>
      players_from_game(game).includes(discord_id)
    )
  ) {
    return [false, "Player is already in a game"];
  }
  if (player.queued.includes(role)) {
    return [false, "Player is already queued for this role"];
  }
  if (player.queued.length >= 2) {
    return [false, "Player is already queued for two roles"];
  }
  player.queued.push(role);
  switch (role) {
    case Role.Top:
      queue.top.push(discord_id);
      break;
    case Role.Jungle:
      queue.jungle.push(discord_id);
      break;
    case Role.Middle:
      queue.middle.push(discord_id);
      break;
    case Role.Bottom:
      queue.bottom.push(discord_id);
      break;
    case Role.Support:
      queue.support.push(discord_id);
      break;
  }
  return [true, ""];
};

const players_from_game = (game: Game): DiscordID[] => {
  const players: DiscordID[] = [];
  for (
    const player_data of game.top.concat(
      game.jungle,
      game.middle,
      game.bottom,
      game.support,
    )
  ) {
    players.push(player_data[0]);
  }
  return players;
};

export const clear_queue = () => {
  queue.top = [];
  queue.jungle = [];
  queue.middle = [];
  queue.bottom = [];
  queue.support = [];
  queue.duplicate_roles = new Set<Role>();
  for (const player of queue.players.values()) {
    player.queued = [];
  }
};

export const update_duplicate_roles = () => {
  const players = new Set<DiscordID>();
  for (
    const player of queue.top.concat(
      queue.jungle,
      queue.middle,
      queue.bottom,
      queue.support,
    )
  ) {
    players.add(player);
  }
  for (const player of players) {
    const player_data = queue.players.get(player);
    if (player_data === undefined) {
      continue;
    }
    if (player_data.queued.length < 2) {
      for (const role of player_data.queued) {
        queue.duplicate_roles.add(role);
      }
    }
  }
};

export const update_number_of_players = () => {
  const players = new Set<DiscordID>();
  for (
    const player of queue.top.concat(
      queue.jungle,
      queue.middle,
      queue.bottom,
      queue.support,
    )
  ) {
    players.add(player);
  }
  queue.number_of_queued_players = players.size;
};

export const display_queue = async () => {
  if (queue_channel_id === BigInt(0)) {
    return;
  }
  const queue_channel = await Bot.helpers.getChannel(queue_channel_id);
  if (queue_channel === undefined) {
    return;
  }
  if (queue_message_id == BigInt(0)) {
    const queue_message = await Bot.helpers.sendMessage(queue_channel_id, {
      embeds: [create_queue_embed()],
    });
    update_queue_message(queue_message.id);
  } else {
    await Bot.helpers.editMessage(queue_channel_id, queue_message_id, {
      embeds: [create_queue_embed()],
    });
  }
};

const create_queue_embed = () => {
  const embed = {
    fields: [
      {
        name: "Queue",
        value: queue_body(),
        inline: false,
      },
      {
        name: "Missing Roles",
        value: get_missing_roles(),
        inline: false,
      },
      {
        name: "# of Unique Players",
        value: queue.number_of_queued_players,
        inline: false,
      },
    ],
    footer: {
      text:
        "Use /queue <role> to join or /leave <role?> to leave | All non-queue messages are deleted",
    },
  } as Embed;
  return embed;
};

const queue_body = () => {
  let body = "";
  body += `${top_emoji} ${queue.top.flatMap((id) => `<@${id}>`).join(", ")} \n`;
  body += `${jungle_emoji} ${
    queue.jungle.flatMap((id) => `<@${id}>`).join(", ")
  } \n`;
  body += `${middle_emoji} ${
    queue.middle.flatMap((id) => `<@${id}>`).join(", ")
  } \n`;
  body += `${bottom_emoji} ${
    queue.bottom.flatMap((id) => `<@${id}>`).join(", ")
  } \n`;
  body += `${support_emoji} ${
    queue.support.flatMap((id) => `<@${id}>`).join(", ")
  }`;
  return body;
};

const get_missing_roles = () => {
  if (queue.top.length < 2) {
    queue.duplicate_roles.add(Role.Top);
  }
  if (queue.jungle.length < 2) {
    queue.duplicate_roles.add(Role.Jungle);
  }
  if (queue.middle.length < 2) {
    queue.duplicate_roles.add(Role.Middle);
  }
  if (queue.bottom.length < 2) {
    queue.duplicate_roles.add(Role.Bottom);
  }
  if (queue.support.length < 2) {
    queue.duplicate_roles.add(Role.Support);
  }
  let missing_roles = "";
  for (const role of queue.duplicate_roles) {
    switch (role) {
      case Role.Top:
        missing_roles += `Top `;
        break;
      case Role.Jungle:
        missing_roles += `Jungle `;
        break;
      case Role.Middle:
        missing_roles += `Middle `;
        break;
      case Role.Bottom:
        missing_roles += `Bottom `;
        break;
      case Role.Support:
        missing_roles += `Support `;
        break;
    }
  }
  return missing_roles === "" ? "All" : missing_roles;
};
