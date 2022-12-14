FROM denoland/deno:alpine-1.28.3

WORKDIR /app

ADD . .

RUN deno cache deps.ts

RUN deno cache mod.ts

RUN deno run -A --unstable npm:prisma@^4.5 generate

CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-write", "--allow-net", "mod.ts"]