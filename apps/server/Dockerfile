FROM node:24

WORKDIR /app

COPY package*.json ./
RUN pnpm install --lock-version --registry="https://mirror-npm.runflare.com"

COPY . .

RUN npx prisma generate

RUN npm run build


EXPOSE 3000
