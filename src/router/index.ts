import { router } from '../lib/trpc.js'
import { taskRouter } from './task-router.js'
import { userRouter } from './user-router.js'

export const appRouter = router({
	task: taskRouter,
	user: userRouter,
})

export type AppRouter = typeof appRouter
