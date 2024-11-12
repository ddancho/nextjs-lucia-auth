# Lucia auth with NextJS demo app

This is a [Next.js](https://nextjs.org/) fullstack project (server components, server actions) bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

App is demo for the lucia auth with postgres database and prisma orm,
basic auth (register, login, logout) is done via email and password,
with register email confirmation.

Besides NextJS following libraries are used in the project:

- [Lucia](https://lucia-auth.com/)
- [React Hook Form](https://www.npmjs.com/package/react-hook-form)
- [Zod - typeScript first schema validation](https://zod.dev/)
- [Prisma ORM](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma)
- [React Hot Toast](https://www.npmjs.com/package/react-hot-toast)
- [Nodemailer](https://www.npmjs.com/package/nodemailer)

## Getting Started

You will need a node.js runtime environment:

- [Node.js](https://nodejs.org/en/)

and docker-compose for running the postgres database, adminer (db viewer) and the mailhog ( local dev email testing )
images in the containers:

- [Docker Compose Install](https://docs.docker.com/compose/install/)

## Next:

- clone or download repository

- copy/paste .env.example and rename to .env and write down required information values,
  the POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB keys will be read in the docker-compose.yml file also.

- write the same values for the USER,PASSWORD,DATABASE in the DATABASE_URL key needed for the
  prisma connection string.

- write required information for email testing

Open terminal in the project folder root...

## Instalattion

Packages installation:

```bash
npm install
```

Database:

- to run docker-compose write following command, it will pull required images from docker hub and
  start in the detached mode, and also it will create local persistent postgres volume:

```bash
docker-compose up -d
```

To stop docker services write command:

```bash
docker-compose down
```

Prisma ORM:

- to create the database according to schema.prisma file write (case for the local dev and no migrations files):

```bash
npx prisma db push
```

## Adminer

For the adminer open [http://localhost:8080](http://localhost:8080) with your browser to see the adminer login page,
the server name in the login page is the name of the postgres service from docker-compose.yml file, so pg_lucia

## Prisma Studio

Or maybe to check prisma studio, write following command:

```bash
npx prisma studio
```

open [http://localhost:5555](http://localhost:5555) with your browser to see the prisma studio.

## Mailhog

Mailhog service is used for the local email development,
open [http://localhost:8025](http://localhost:8025) for the web ui.

## App

Nextjs development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
