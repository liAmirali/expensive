FROM node:20.13

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]

EXPOSE 3000
