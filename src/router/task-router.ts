import type { Task, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'

import { EventEmitter } from 'events'
import { z } from 'zod'
import type { TaskWithUser } from '../@types/task-with-user.js'
import { db } from '../lib/db.js'
import { publicProcedure, router } from '../lib/trpc.js'

const ee = new EventEmitter()

export const taskRouter = router({
	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				completed: z.boolean(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (ctx.user === null) {
				throw new TRPCError({ code: 'UNAUTHORIZED' })
			}

			const task = await db.task.findUnique({
				where: {
					id: input.id,
				},
			})

			if (task == null) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			const updated = await db.task.update({
				where: {
					id: input.id,
				},
				data: {
					completed: input.completed,
					updatedAt: new Date(),
				},
			})

			return updated
		}),
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
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
		}),
	remove: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
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
		}),
	list: publicProcedure.query(async () => {
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
	}),
	onCreate: publicProcedure.subscription(() => {
		return observable<
			Task & {
				user: User
			}
		>((emit) => {
			const onCreate = (data: TaskWithUser) => {
				emit.next(data)
			}

			ee.on('create', onCreate)

			return () => {
				ee.off('create', onCreate)
			}
		})
	}),
	onDelete: publicProcedure.subscription(() => {
		return observable<Task>((emit) => {
			const onDelete = (data: Task) => {
				emit.next(data)
			}

			ee.on('delete', onDelete)

			return () => {
				ee.off('delete', onDelete)
			}
		})
	}),
})
