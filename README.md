# Fully typed Fastify + React starter kit

This project is a starter kit for building applications with Fastify and React in TypeScript.

- [Fully typed Fastify + React starter kit](#fully-typed-fastify--react-starter-kit)
  - [Reasons for it](#reasons-for-it)
  - [How to use it](#how-to-use-it)
  - [Description](#description)
    - [Database (SQL + Prisma)](#database-sql--prisma)
    - [Backend (Fastify + TRPC)](#backend-fastify--trpc)
    - [State management (Jotai)](#state-management-jotai)
    - [Testing (Vitest)](#testing-vitest)
    - [SSR](#ssr)
  - [Deployment](#deployment)
    - [Continuous deployment](#continuous-deployment)
    - [flyctl CLI](#flyctl-cli)
    - [Dockerfile](#dockerfile)
    - [Database (SQLite)](#database-sqlite)

## Reasons for it

* having an alternative to NextJS with more control over its components
* API + Frontend in the same place allows quicker development
* using latest Node version and being limited by Lambda's Node version

## How to use it

```bash
npm install            # install dependencies
npx prisma migrate dev # run migrations
npm run dev            # start project on localhost:3000
```

## Description

There are many opinionated choices into this starter kit that I am going to list and motivate.  
If any of them is not something that you need, it is easy to remove it from this starter.

### Database (SQL + Prisma)

[Prisma](https://www.prisma.io) is providing the best experience for editing and querying a SQL database.  
Types generated for each table and query can be reused in the codebase and add safety.

### Backend (Fastify + TRPC)

[Fastify](https://www.fastify.io) is the fastest backend framework for NodeJS, well maintained and following many best practices.
[TRPC](https://trpc.io) takes advantage of TypeScript for writing API routes that can be type safely requested from frontend.

### State management (Jotai)

I think that the said "With great power comes great responsibility" is very true with [Jotai](https://jotai.org).  
Each piece of state is called "atom" and can be reused and watched anywhere in the codebase.  
I prefer to encapsulate their power into reusable hooks.

### Testing (Vitest)

[Vitest](https://vitest.dev) has API similar to Jest, it's much faster and can be used to test both client and server code.  
My preferred way to debug tests is by using this [suggested VSCode launch configuration](https://vitest.dev/guide/debugging.html).

### SSR

This starter doesn't include server side rendering, which comes with more complications and questions.  
SSR is still achievable by following this [Vite page](https://vitejs.dev/guide/ssr.html).

## Deployment

I explored for the first time deployment on [Fly.io](https://fly.io) and after some learning steps, I have been happy about it.
I'll mention my key learning points:

### Continuous deployment

This repo already contains a [GitHub action provided by Fly.io](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/) for continuous deployment.  
Read the documentation to generate a Fly.io to provide as GitHub secret.  
Each time there is a new merge on main branch Docker image is built and deployed.

### flyctl CLI

As mentioned clearly on [Fly.io](https://fly.io) home page, the CLI is the first step to take.  
`fly launch` will detect the type of project and deploy it.

### Dockerfile

I try to stay away from Docker if I can... but I keep coming back at it as soon as I want more control over the configuration.
The current Dockerfile creates uses a base Debian image with Node 18 and it.

* fly CLI detects the type of project automatically
* port 3000 is exposed on Dockerfile and picked up by fly.io by [internal_port](https://fly.io/docs/reference/configuration/) configuratio setting in fly.toml
* env vars are passed from fly.toml
* secrets, like a database URL [can be added through CLI](https://fly.io/docs/reference/secrets/)
* in the `./start.sh` script I run database migrations before starting the Node app

### Database (SQLite)

I didn't want to commit to a running PostgreSQL instance for this project and used SQLite.  
By using [fly.io volumes](https://fly.io/docs/reference/volumes/) and the `[mounts]` section in fly.toml I have a persistent disk access on the path `/data` that I use for storing SQLite data.

