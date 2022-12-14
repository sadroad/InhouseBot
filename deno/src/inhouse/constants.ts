import { init_or_get_server_info } from "../database/helpers.ts";

export const RANKPOINTTABLE = [
  ["CHALLENGER 1", 45],
  ["GRANDMASTER 1", 42],
  ["MASTER 1", 40],
  ["DIAMOND 1", 36],
  ["DIAMOND 2", 34],
  ["DIAMOND 3", 31],
  ["DIAMOND 4", 29],
  ["PLATINUM 1", 27],
  ["PLATINUM 2", 26],
  ["PLATINUM 3", 23],
  ["PLATINUM 4", 21],
  ["GOLD 1", 20],
  ["GOLD 2", 19],
  ["GOLD 3", 18],
  ["GOLD 4", 17],
  ["SILVER 1", 16],
  ["SILVER 2", 16],
  ["SILVER 3", 15],
  ["SILVER 4", 15],
  ["BRONZE 1", 15],
  ["BRONZE 2", 15],
  ["BRONZE 3", 15],
  ["BRONZE 4", 15],
  ["IRON 1", 15],
  ["IRON 2", 15],
  ["IRON 3", 15],
  ["IRON 4", 15],
];

const server_info = await init_or_get_server_info();
export const queue_channel_id = server_info.queue_channel;
export const command_channel_id = server_info.command_channel;
export const top_emoji = server_info.top_emoji;
export const jungle_emoji = server_info.jungle_emoji;
export const middle_emoji = server_info.middle_emoji;
export const bottom_emoji = server_info.bottom_emoji;
export const support_emoji = server_info.support_emoji;
