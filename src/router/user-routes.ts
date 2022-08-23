import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../env.js'
import { createRouter } from '../lib/create-router.js'
import { db } from '../lib/db.js'

export const usersRouter = createRouter()
  .mutation('login', {
    input: z.string(),
    async resolve({ input, ctx }): Promise<{ token: string }> {
      let user = await db.user.findFirst({
        where: {
          email: input,
        },
      })

      if (!user) {
        user = await db.user.create({
          data: {
            email: input,
          },
        })
      }

      const token = jwt.sign(user, env.JWT_SECRET)
      ctx.req.session.token = token

      return { token }
    },
  })
  .query('list', {
    resolve: async () => {
      const users = await db.user.findMany()

      return users
    },
  })
