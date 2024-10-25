#!/bin/bash
echo "### Running the entryoint script ###"

chmod +x "./wait-for-it.sh"
bash "./wait-for-it.sh" postgres:5432

npx prisma migrate deploy

npx prisma generate

npm run start:dev
