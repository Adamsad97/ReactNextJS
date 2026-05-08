This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Installation de dépendance

npm install

## Demarrage mode dev

npm run dev

## Demarrage mode prod

npm run build
puis
npm start

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Ma BD

│ https://create-db.prisma.io/claim?projectID=proj_cmotzj1jy0dh0yhdxtmbgtepi&utm_source=create-db&utm_medium=cli

# Connexion

postgres://788c2c12047bea92dad31404b97cd6050c56dfa3c6ea02f988725d08b410cb51:sk_ZMZOuDFRnCJ4IBm1Y9QBC@db.prisma.io:5432/postgres?sslmode=require

## .env à la racine du projet

DATABASE_URL= postgres://6f362fc1a63c24187be7f8bed14446f2cbc0ce214ac58cd0a0402a10a0fd30ae:sk_re_LxHyQNS9RFVNdt6FTH@db.prisma.io:5432/postgres?sslmode=require

JWT_SECRET="d6840975b83db1c3cc4451555aa1ba77d3076f02a148c4c3d5a9a492314b1c48b0b522dbed8d81663b71effa69f288775c5c377c554f45815510208c8cb95173"

NEXT_PUBLIC_APP_URL="http://localhost:3000"

npm install dotenv

1. npx prisma init // Afaire que lorsque l'on n'a prisma déjà installé
2. npx create-db
3. npx prisma migrate dev --name init
4. npx prisma generate
# ReactNextJS
