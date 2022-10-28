-- Your SQL goes here
CREATE TABLE "server_information" (
  "id" SERIAL PRIMARY KEY,
  "queue_channel" bigint,
  "command_channel" bigint,
  "top_emoji" varchar,
  "jungle_emoji" varchar,
  "mid_emoji" varchar,
  "bot_emoji" varchar,
  "sup_emoji" varchar
);
