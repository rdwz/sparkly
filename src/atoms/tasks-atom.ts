import type { Task } from '@prisma/client'
import { atomWithImmer } from 'jotai/immer'
import type { TaskWithUser } from '../@types/task-with-user'
import { trpc } from '../lib/trpc'

export const tasksAtom = atomWithImmer<Record<string, TaskWithUser>>({})

type UseTasksProps = {
  onCreate?: (task: TaskWithUser) => void
  onDelete?: (task: Task) => void
}

export const useTasks = (props: UseTasksProps = {}) => {
  const create = trpc.useMutation(['task.create'])
  const deleteTask = trpc.useMutation(['task.remove'])
  const list = trpc.useQuery(['task.list'])

  trpc.useSubscription(['task.onCreate'], {
    onNext: (task: TaskWithUser) => {
      props.onCreate?.(task)
    },
    onError: console.error,
  })

  trpc.useSubscription(['task.onDelete'], {
    onNext: (task: Task) => {
      props.onDelete?.(task)
    },
    onError: console.error,
  })

  return {
    create: async (task: { name: string }) => {
      return await create.mutateAsync({ name: task.name })
    },
    list,
    delete: (id: string) => {
      return deleteTask.mutate({ id })
    },
  }
}
