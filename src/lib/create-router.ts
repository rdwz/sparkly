import * as trpc from '@trpc/server'
import type { Context } from './create-context.js'

/**
 * Helper function to create a router with context
 */
export function createRouter() {
  return trpc.router<Context>()
}
