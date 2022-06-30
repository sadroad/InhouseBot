
FROM rust:1.61 AS builder
RUN USER=root cargo new --bin bot
WORKDIR /bot
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release && rm src/*.rs
COPY ./src ./src
COPY ./migrations ./migrations
RUN rm ./target/release/deps/bot*
RUN cargo build -v --release

FROM debian:bullseye-slim
COPY --from=builder /bot/target/release/bot /usr/src/bot
RUN apt-get update -y && apt-get install -y libpq-dev ca-certificates && apt-get clean
CMD ["/usr/src/bot"]