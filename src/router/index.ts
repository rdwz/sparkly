import { createRouter } from '../lib/create-router.js'
import { taskRouter } from './task-router.js'
import { userRouter } from './user-router.js'
export const router = createRouter()
  // .transformer(superjson)
  .query('health', {
    async resolve() {
      return 'yay!'
    },
  })
  .merge('user.', userRouter)
  .merge('task.', taskRouter)

export type Router = typeof router
