import * as trpc from '@trpc/server'
import type { Context } from './create-context.js'

export function createRouter() {
	return trpc.router<Context>()
}
