import { createRouter } from '../lib/create-router.js'
import { usersRouter } from './user-routes.js'

export const router = createRouter().merge('user.', usersRouter)
export type Router = typeof router
