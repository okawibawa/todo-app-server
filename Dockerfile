FROM oven/bun:latest

WORKDIR /app

COPY package.json .

RUN bun install

COPY . .

RUN bun build ./src/index.ts --outdir ./build --target node

EXPOSE 3010

CMD [ "bun", "run", "build/index.js" ]
