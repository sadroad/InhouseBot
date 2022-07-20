FROM lukemathwalker/cargo-chef:latest-rust-1.62 as chef
WORKDIR /app

FROM chef as PLANNER
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef as BUILDER
RUN USER=root cargo new --bin bot
WORKDIR /bot
COPY --from=PLANNER /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
COPY --from=builder /bot/target/release/bot /usr/src/bot
RUN apt-get update -y && apt-get install -y libpq-dev ca-certificates && apt-get clean
CMD ["/usr/src/bot"]