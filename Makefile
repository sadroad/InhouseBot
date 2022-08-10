ifneq (,$(wildcard ./.env))
    include .env
    export
endif

generate:
	diesel migration generate $(NAME)

revert:
	diesel migration revert

migrate: 
	@DATABASE_URL=$(DATABASE_URL) \
	diesel migration run

run:
	cargo fmt
	@DISCORD_TOKEN=$(DISCORD_TOKEN) \
	RGAPI_KEY=$(RGAPI_KEY) \
	LOADING_EMOJI=$(LOADING_EMOJI) \
	POSTGRES_PASSWORD=$(POSTGRES_PASSWORD)\
	DATABASE_URL=$(DATABASE_URL) \
	cargo run

flamegraph:
	@DISCORD_TOKEN=$(DISCORD_TOKEN) \
	RGAPI_KEY=$(RGAPI_KEY) \
	LOADING_EMOJI=$(LOADING_EMOJI) \
	POSTGRES_PASSWORD=$(POSTGRES_PASSWORD)\
	DATABASE_URL=$(DATABASE_URL) \
	cargo flamegraph
