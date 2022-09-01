import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import middie from '@fastify/middie'
import fastifySession from '@fastify/session'
import ws from '@fastify/websocket'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify/dist/trpc-server-adapters-fastify.cjs.js'
import fastify from 'fastify'
import { createViteMiddleware } from './create-vite-middleware.js'
import { env as defaultEnv } from './env.js'
import { createContext } from './lib/create-context.js'
import { router } from './router/index.js'

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

export const createServer = async (env = defaultEnv) => {
  const server = fastify({
    maxParamLength: 5000,
    logger: envToLogger[env.NODE_ENV],
  })

  await server.register(cookie, {
    secret: env.SECRET,
  } as FastifyCookieOptions)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  await server.register(fastifySession, {
    cookieName: 'sessionId',
    secret: env.SECRET,
    cookie: {
      secure: false,
      expires: tomorrow,
    },
  })

  await server.register(middie)
  await server.register(ws)
  await server.register(fastifyTRPCPlugin, {
    useWSS: true,
    prefix: '/trpc',
    trpcOptions: { router, createContext },
  })

  await server.use(await createViteMiddleware())

  return server
}
