import { Rating } from "../../deps.ts";

export interface Player {
  accounts: PUUID[];
  rating: Rating;
  queued: Role[];
}

export type PUUID = string;

export type DiscordID = BigInt;

export interface QueueManager {
  top: DiscordID[];
  jungle: DiscordID[];
  middle: DiscordID[];
  bottom: DiscordID[];
  support: DiscordID[];
  players: Map<DiscordID, Player>;
  missing_roles: Set<Role>;
}

export interface GameManager {
  current_games: Game[];
  tentative_games: Game[];
}

export interface Game {
  id: number;
  message_id: BigInt;
  expected_winrate: number;
  canceled: boolean;
  top: [DiscordID, PlayerState][];
  jungle: [DiscordID, PlayerState][];
  middle: [DiscordID, PlayerState][];
  bottom: [DiscordID, PlayerState][];
  support: [DiscordID, PlayerState][];
}

export interface Rank {
  tier: string;
  division: string;
  lp: string;
  error: boolean;
}

export interface AccountInfo {
  name: string;
  account_level: number;
  rank2021: Rank;
  rank2020: Rank;
  current_rank: string;
  current_rank_lp: string;
  number_of_games: string;
  winrate: string;
}

export enum PlayerState {
  Accepted,
  Declined,
  Unsure,
}

export enum Role {
  Top,
  Jungle,
  Middle,
  Bottom,
  Support,
}
