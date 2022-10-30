import type { Task } from '@prisma/client'
import { atomWithImmer } from 'jotai/immer'
import type { TaskWithUser } from '../@types/task-with-user'
import { trpcReact } from '../lib/trpc-react.js'

export const tasksAtom = atomWithImmer<Record<string, TaskWithUser>>({})

type UseTasksProps = {
	onCreate?: (task: TaskWithUser) => void
	onDelete?: (task: Task) => void
}

export const useTasks = (props: UseTasksProps = {}) => {
	const create = trpcReact.task.create.useMutation()
	const deleteTask = trpcReact.task.remove.useMutation()
	const list = trpcReact.task.list.useQuery(undefined, {
		refetchOnReconnect: true,
		refetchOnMount: true,
	})

	trpcReact.task.onCreate.useSubscription(undefined, {
		onData: (task: TaskWithUser) => {
			props.onCreate?.(task)
		},
		onError: console.error,
	})

	trpcReact.task.onDelete.useSubscription(undefined, {
		onData: (task: Task) => {
			props.onDelete?.(task)
		},
		onError: console.error,
	})

	return {
		create: async (task: { name: string }) => {
			return create.mutateAsync({ name: task.name })
		},
		list,
		delete: (id: string) => {
			return deleteTask.mutate({ id })
		},
	}
}
