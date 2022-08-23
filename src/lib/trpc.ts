import { createReactQueryHooks } from '@trpc/react'
import type { Router } from '../router/index.js'

export const trpc = createReactQueryHooks<Router>()
