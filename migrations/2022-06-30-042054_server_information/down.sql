-- This file should undo anything in `up.sql`
ALTER TABLE "server_information"
ALTER COLUMN top_emoji TYPE varchar,
ALTER COLUMN jungle_emoji TYPE varchar,
ALTER COLUMN mid_emoji TYPE varchar,
ALTER COLUMN bot_emoji TYPE varchar,
ALTER COLUMN sup_emoji TYPE varchar;