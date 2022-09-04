import type { AsyncReturnType } from 'type-fest'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { createServer } from '../../create-server'
import * as context from '../../lib/create-context'
import { db } from '../../lib/db'

describe('task-router', () => {
  let server: AsyncReturnType<typeof createServer>

  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.close()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns tasks', async () => {
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

  describe('remove', () => {
    describe('when user session is not present', () => {
      it('returns not authorised', async () => {
        const createContextSpy = vi
          .spyOn(context, 'createContext')
          .mockResolvedValue({
            user: null,
          } as any)
        const response = await server.inject({
          method: 'POST',
          url: '/trpc/task.remove',
          payload: {
            id: 'fake-id',
          },
        })

        expect(createContextSpy).toHaveBeenCalledOnce()
        expect(response.statusCode).equals(401)
      })
    })

    describe('when the task is not existent', async () => {
      it('returns bad request', async () => {
        const createContextSpy = vi
          .spyOn(context, 'createContext')
          .mockResolvedValueOnce({
            user: {
              email: 'email@test.it',
            },
          } as any)
        vi.spyOn(db.task, 'findUnique').mockResolvedValueOnce(null)
        const response = await server.inject({
          method: 'POST',
          url: '/trpc/task.remove',
          payload: {
            id: 'fake-id',
          },
        })

        expect(createContextSpy).toHaveBeenCalledOnce()
        expect(response.statusCode).equals(400)
      })
    })
  })
})
