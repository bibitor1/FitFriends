Инструкция по запуску проекта FitFriends (команды следует выполнять в корневом каталоге проекта):

- Запуск серверной части проекта в режиме разработки:

1. Выполните команду `npm install` для инициализации библиотек;

2. Создайте в корневом каталоге проекта .env файл и скопируйте туда переменные окружения из файла .env-example;

3. Для создания контейнера базы данных в докере выполните команду:
`docker compose \
--file docker-compose.dev.yml \
--env-file .env \
--project-name "fitfriends" \
up -d`

4. Выполните команду `npx prisma migrate dev` для инициализации базы данных;

5. Выполните команду `npx ts-node ./prisma/seed.ts` для наполнения базы данных;

6. Выполните команду `npx nx run-many --all --target=lint` для проверки проекта;

7. Выполните команду `npx nx run backend:serve` для запуска серверной части проекта.

- Запуск клиентской части проекта в режиме разработки:

1. Создайте в папке frontend .env файл и скопируйте туда переменные окружения из файла .env-example;

2. Выполните команду `npx nx run frontend:serve` для запуска клиентской части проекта.

3. Выполните команду `npx nx run frontend:test` для прохождения тестов.

- Запуск серверной части проекта в режиме прод:

1. Выполните команду `npx nx build backend --prod` для сборки проекта.

2. Выполните команду `docker build --file ./apps/backend/Dockerfile --tag fit-friends-backend:latest .` для сборки Docker образа.

- Запуск серверной части проекта в режиме прод:

1. Выполните команду `npx nx build frontend --prod` для сборки проекта.

2. Выполните команду `docker build --file ./apps/frontend/Dockerfile --tag fit-friends-frontend:latest .` для сборки Docker образа.

- Запуск приложения в Docker:
1. Выполните команду:
`docker compose \
--file docker-compose.prod.yml \
--env-file .env \
--project-name "fitfriends" \
up -d`

2. Приложение запускается по умолчанию на порту 80: [localhost](http://localhost:80).
