import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import middie from '@fastify/middie'
import fastifySession from '@fastify/session'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify/dist/trpc-server-adapters-fastify.cjs.js'
import fastify from 'fastify'
import fastifyPrintRoutes from 'fastify-print-routes'
import { createViteMiddleware } from './create-vite-middleware.js'
import { env } from './env.js'
import { createContext } from './lib/create-context.js'
import { router } from './router/index.js'

export const createServer = async () => {
  const server = fastify({
    maxParamLength: 5000,
    logger:
      env.NODE_ENV === 'development'
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            },
          }
        : {},
  })

  await server.register(fastifyPrintRoutes)
  await server.register(middie)
  await server.use(await createViteMiddleware())
  await server.register(cookie, {
    secret: env.SECRET,
  } as FastifyCookieOptions)
  await server.register(fastifySession, {
    secret: env.SECRET,
  })
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router, createContext },
  })

  return server
}
