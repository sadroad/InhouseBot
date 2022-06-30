-- Your SQL goes here
CREATE TABLE "player" (
  "discord_id" bigint PRIMARY KEY,
  "accounts" text[] NOT NULL
);
