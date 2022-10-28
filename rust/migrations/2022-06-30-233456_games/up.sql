-- Your SQL goes here
CREATE TABLE "games" (
  "id" int PRIMARY KEY,
  "players" bigint[] NOT NULL
);

CREATE TABLE "game_roles" (
  "id" SERIAL PRIMARY KEY,
  "discord_id" bigint NOT NULL,
  "game_id" int NOT NULL,
  "role" text NOT NULL
);

ALTER TABLE "game_roles" ADD FOREIGN KEY ("discord_id") REFERENCES "player" ("discord_id");

ALTER TABLE "game_roles" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");