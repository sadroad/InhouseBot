-- Your SQL goes here
ALTER TABLE "server_information"
ALTER COLUMN queue_channel SET NOT NULL,
ALTER COLUMN command_channel SET NOT NULL,
ALTER COLUMN top_emoji TYPE text,
ALTER COLUMN top_emoji SET NOT NULL,
ALTER COLUMN jungle_emoji TYPE text,
ALTER COLUMN jungle_emoji SET NOT NULL,
ALTER COLUMN mid_emoji TYPE text,
ALTER COLUMN mid_emoji SET NOT NULL,
ALTER COLUMN bot_emoji TYPE text,
ALTER COLUMN bot_emoji SET NOT NULL,
ALTER COLUMN sup_emoji TYPE text,
ALTER COLUMN sup_emoji SET NOT NULL;