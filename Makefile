ifneq (,$(wildcard ./.env))
    include .env
    export
endif

run:
	@DISCORD_TOKEN=${DISCORD_TOKEN} \
	PREFIX=${PREFIX} \
	RGAPI_KEY=${RGAPI_KEY} \
	cargo run
