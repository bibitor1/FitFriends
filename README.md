### Проект FitFriends

API проекта находится по адресу: http://localhost:4000/spec

Инструкция по запуску проекта (команды следует выполнять в корневом каталоге проекта):

- Запуск серверной части проекта:

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

- Запуск клиентской части проекта:

1. Создайте в папке frontend .env файл и скопируйте туда переменные окружения из файла .env-example;

2. Выполните команду `npx nx run frontend:serve` для запуска клиентской части проекта.

npx nx run frontend:test
