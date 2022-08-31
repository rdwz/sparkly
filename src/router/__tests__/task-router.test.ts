import { describe, expect, it, vi } from 'vitest'
import { createServer } from '../../create-server'
import { db } from '../../lib/db'

describe('task-router', () => {
  it('returns tasks', async () => {
    const server = await createServer()

    vi.spyOn(db.task, 'findMany').mockResolvedValueOnce([
      {
        id: 'test',
        name: 'Parappa',
        completed: false,
        user: {
          id: 'user-id',
          email: 'user@email.com',
        },
      } as any,
    ])

    const response = await server.inject('/trpc/task.list')

    expect(response.statusCode).equals(200)
    expect(response.json().result.data).toMatchObject({
      test: {
        id: 'test',
        name: 'Parappa',
        completed: false,
        user: { id: 'user-id', email: 'user@email.com' },
      },
    })
  })
})
