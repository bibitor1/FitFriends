# FitFriends
docker compose \
--file docker-compose.yml \
--env-file .env \
--project-name "fitfriends" \
up -d

npx prisma migrate dev

npx ts-node ./prisma/seed.ts

npx nx run backend:serve
