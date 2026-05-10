0. npx prisma init : A faire que lorsque l'on n'a pas prisma installé (Donc cette commande, vous n'en avez pas besoin ici: Commerncez à partir de 1.)

## Installation et mise en place des dépendances

1. cd .\ReactNextJS
2. npm install
3. .env (à la racine du projet)
   DATABASE_URL= A changer après l'exécution de: npx create-db

   JWT_SECRET="d6840975b83db1c3cc4451555aa1ba77d3076f02a148c4c3d5a9a492314b1c48b0b522dbed8d81663b71effa69f288775c5c377c554f45815510208c8cb95173"

   NEXT_PUBLIC_APP_URL="http://localhost:3000"

4. npx create-db
5. Mettre à jour DATABASE_URL dans .env
6. npx prisma migrate dev --name init
7. npx prisma generate

## Demarrage mode dev

npm run dev

## Demarrage mode prod

npm run build
puis
npm start

## Démarrage via Docker

docker-compose up -d

## Build

docker compose up --build

## Arrêt des services

docker compose down
