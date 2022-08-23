import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import type { FastifyRequest } from 'fastify'

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.authorization ?? 'anonymous' }
  const customReq: FastifyRequest & {
    session: {
      token?: string
    }
  } = req

  return { req: customReq, res, user }
}

export type Context = inferAsyncReturnType<typeof createContext>
