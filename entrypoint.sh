#!/bin/bash

chmod +x "./wait-for-it.sh"
bash "./wait-for-it.sh" postgres:5432

npx prisma generate
npx prisma migrate deploy

npm run start:dev
