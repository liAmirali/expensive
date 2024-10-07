FROM node:20.13

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build


EXPOSE 3000
