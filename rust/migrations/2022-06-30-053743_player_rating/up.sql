-- Your SQL goes here
CREATE TABLE "player_ratings" (
  "discord_id" bigint PRIMARY KEY,
  "mu" float8 NOT NULL,
  "sigma" float8 NOT NULL
);

ALTER TABLE "player_ratings" ADD FOREIGN KEY ("discord_id") REFERENCES "player" ("discord_id");