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
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
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
