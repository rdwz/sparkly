import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../env.js'
import { createRouter } from '../lib/create-router.js'
import { db } from '../lib/db.js'

export const userRouter = createRouter()
  .mutation('login', {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input, ctx }): Promise<{ email: string }> {
      let user = await db.user.findFirst({
        where: {
          email: input.email.trim(),
        },
      })

      if (!user) {
        user = await db.user.create({
          data: {
            email: input.email.trim(),
          },
        })
      }

      const token = jwt.sign(user, env.JWT_SECRET)
      ctx!.req.session.set('token', token)

      return { email: input.email }
    },
  })
  .mutation('logout', {
    input: z.object({
      email: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      ctx.req.log.info(`Logging out: ${input}`)

      ctx!.req.session.destroy()

      return
    },
  })
  .query('list', {
    resolve: async () => {
      const users = await db.user.findMany()

      return users
    },
  })
