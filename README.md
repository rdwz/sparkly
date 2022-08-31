# Full typed Fastify React 

This project is a starter kit for building applications with Fastify and React in TypeScript.

- [Full typed Fastify React](#full-typed-fastify-react)
  - [Reasons for it](#reasons-for-it)
  - [Description](#description)
    - [Database (SQL + Prisma)](#database-sql--prisma)
    - [Backend (Fastify + TRPC)](#backend-fastify--trpc)
    - [State management (Jotai)](#state-management-jotai)
    - [Testing (Vitest)](#testing-vitest)

## Reasons for it

* having an alternative to NextJS with more control over its components
* API + Frontend in the same place allows quicker development
* I can try out latest Node version

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
