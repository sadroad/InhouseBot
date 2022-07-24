FROM debian:bullseye-slim
RUN apt-get update -y && apt-get install -y libpq-dev ca-certificates wget && apt-get clean
RUN wget https://github.com/AlexJVG/InhouseBot/releases/latest/download/bot
RUN mv bot /usr/src/bot
RUN chmod +x /usr/src/bot
CMD ["/usr/src/bot"]