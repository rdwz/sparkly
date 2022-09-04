import type { Task } from '@prisma/client'
import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { useCallback, useEffect } from 'react'
import type { TaskWithUser } from '../@types/task-with-user'
import { trpc } from '../lib/trpc'
import { authAtom } from './auth-atom'

export const tasksAtom = atomWithImmer<Record<string, TaskWithUser>>({})

export const useTasks = () => {
  const [auth] = useAtom(authAtom)
  const create = trpc.useMutation(['task.create'])
  const deleteTask = trpc.useMutation(['task.remove'])
  const list = trpc.useQuery(['task.list'])
  const [updatedTasks, setUpdatedTasks] = useAtom(tasksAtom)
  const addTasks = useCallback(
    (tasks: Record<string, TaskWithUser>) => {
      setUpdatedTasks((draft) => {
        Object.assign(draft, tasks)
      })
    },
    [setUpdatedTasks],
  )
  const removeTask = useCallback(
    (task: Task) => {
      setUpdatedTasks((draft) => {
        delete draft[task.id]
      })
    },
    [setUpdatedTasks],
  )

  useEffect(() => {
    if (list.data) {
      addTasks(list.data)
    }
  }, [list.data])

  trpc.useSubscription(['task.onCreate'], {
    onNext: (task: TaskWithUser) => {
      if (task.user.email !== auth?.email) {
        addTasks({
          [task.id]: task,
        })
      }
    },
    onError: console.error,
  })

  trpc.useSubscription(['task.onDelete'], {
    onNext: (task: Task) => {
      removeTask(task)
    },
    onError: console.error,
  })

  return {
    create: (task: { name: string }) => {
      return create.mutateAsync({ name: task.name })
    },
    list,
    updatedTasks,
    delete: (id: string) => {
      return deleteTask.mutate({ id })
    },
  }
}
