import type { Task, User } from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { EventEmitter } from 'events'
import { z } from 'zod'
import type { TaskWithUser } from '../@types/task-with-user.js'
import { createRouter } from '../lib/create-router.js'
import { db } from '../lib/db.js'

const ee = new EventEmitter()

export const taskRouter = createRouter()
	.mutation('create', {
		input: z.object({
			name: z.string(),
		}),
		resolve: async ({ ctx, input }) => {
			if (ctx.user == null) {
				throw new TRPCError({ code: 'UNAUTHORIZED' })
			}

			const totalTasksByUser = await db.task.count({
				where: {
					userId: ctx.user.id,
				},
			})

			if (totalTasksByUser > 5) {
				throw new TRPCError({ code: 'CONFLICT' })
			}

			const task = await db.task.create({
				data: {
					completed: false,
					userId: ctx.user.id,
					name: input.name,
				},
				include: {
					user: true,
				},
			})

			ee.emit('create', task)

			return task
		},
	})
	.mutation('remove', {
		input: z.object({
			id: z.string(),
		}),
		resolve: async ({ ctx, input }) => {
			if (ctx.user === null) {
				throw new TRPCError({ code: 'UNAUTHORIZED' })
			}

			const task = await db.task.findUnique({
				where: {
					id: input.id,
				},
				include: {
					user: true,
				},
			})

			if (task == null) {
				throw new TRPCError({ code: 'BAD_REQUEST' })
			}

			if (task.user.email !== ctx.user.email) {
				throw new TRPCError({ code: 'UNAUTHORIZED' })
			}

			await db.task.delete({
				where: {
					id: input.id,
				},
			})

			ee.emit('delete', task)

			return task
		},
	})
	.subscription('onCreate', {
		resolve() {
			return new trpc.Subscription<
				Task & {
					user: User
				}
			>((emit) => {
				const onCreate = (data: TaskWithUser) => {
					emit.data(data)
				}

				ee.on('create', onCreate)

				return () => {
					ee.off('create', onCreate)
				}
			})
		},
	})
	.subscription('onDelete', {
		resolve() {
			return new trpc.Subscription<Task>((emit) => {
				const onDelete = (data: Task) => {
					emit.data(data)
				}

				ee.on('delete', onDelete)

				return () => {
					ee.off('delete', onDelete)
				}
			})
		},
	})

	.query('list', {
		resolve: async (): Promise<Record<string, TaskWithUser>> => {
			const tasks = await db.task.findMany({
				include: {
					user: true,
				},
			})

			const groupedTasks: Record<string, TaskWithUser> = tasks.reduce(
				(acc: Record<string, TaskWithUser>, task: TaskWithUser) => {
					acc[task.id] = task

					return acc
				},
				{},
			)

			return groupedTasks
		},
	})
