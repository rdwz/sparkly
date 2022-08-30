import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { useCallback, useEffect } from 'react'
import type { TaskWithUser } from '../@types/task-with-user'
import { trpc } from '../lib/trpc'
import { authAtom } from './auth-atom'

export const tasksAtom = atomWithImmer<Record<string, TaskWithUser>>({})

export const useTasks = () => {
  const [auth] = useAtom(authAtom)
  const query = trpc.useQuery(['task.list'])
  const [tasks, setTasks] = useAtom(tasksAtom)
  const addTasks = useCallback(
    (tasks: Record<string, TaskWithUser>) => {
      setTasks((draft) => {
        Object.assign(draft, tasks)
      })
    },
    [setTasks],
  )

  useEffect(() => {
    if (query.data) {
      addTasks(query.data)
    }
  }, [query.data])

  trpc.useSubscription(['task.onCreate'], {
    onNext: (task: TaskWithUser) => {
      if (task.user.email !== auth?.email) {
        addTasks({
          [task.id]: task,
        })
      }
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return {
    query,
    tasks,
  }
}
