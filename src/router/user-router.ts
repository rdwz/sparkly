import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../env.js'
import { db } from '../lib/db.js'
import { publicProcedure, router } from '../lib/trpc.js'

export const userRouter = router({
	login: publicProcedure
		.input(
			z.object({
				email: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			let user = await db.user.findFirst({
				where: {
					email: input.email.trim(),
				},
			})

			if (user === null) {
				user = await db.user.create({
					data: {
						email: input.email.trim(),
					},
				})
			}

			const token = jwt.sign(user, env.JWT_SECRET)
			ctx.req.session.set('token', token)

			return { email: input.email }
		}),
	logout: publicProcedure
		.input(
			z.object({
				email: z.string(),
			}),
		)
		.mutation(async ({ ctx }) => {
			await ctx.req.session.destroy()
		}),
	list: publicProcedure.query(async () => {
		const users = await db.user.findMany()

		return users
	}),
})
