import { Rating } from "../../deps.ts";
import { configs } from "../../configs.ts";
import { PlatformId, RiotAPI } from "../../deps.ts";
import { add_player, get_players } from "../database/helpers.ts";
import {
  DiscordID,
  Player,
  PUUID,
  QueueManager,
  Role,
} from "../types/inhouse.ts";
import log from "../utils/logger.ts";

export const queue: QueueManager = {
  top: [],
  jungle: [],
  middle: [],
  bottom: [],
  support: [],
  players: new Map<DiscordID, Player>(),
  missing_roles: new Set<Role>(),
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
