import type { User } from '@prisma/client'
import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import type { FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'

export function createContext({ req, res }: CreateFastifyContextOptions) {
  let user: User | null = null
  const customReq: FastifyRequest & {
    session: {
      token?: string
      user?: User
    }
  } = req
  const token = customReq?.session?.get('token') as string | undefined

  if (token) {
    user = jwt.verify(token, env.JWT_SECRET) as User
  }

  return { req: customReq, res, user }
}

export type Context = inferAsyncReturnType<typeof createContext>
