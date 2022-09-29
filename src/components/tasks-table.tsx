import type { Task } from '@prisma/client'
import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { useCallback, useEffect } from 'react'
import { Button, Progress } from 'react-daisyui'
import type { TaskWithUser } from '../@types/task-with-user'
import { useAuth } from '../atoms/auth-atom'
import { useTasks } from '../atoms/tasks-atom'

const updatedTasksAtom = atomWithImmer<Record<string, TaskWithUser>>({})

export const TasksTable = () => {
	const auth = useAuth()
	const [updatedTasks, setUpdatedTasks] = useAtom(updatedTasksAtom)
	const removeTask = useCallback(
		(task: Task) => {
			setUpdatedTasks((draft) => {
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete draft[task.id]
			})
		},
		[setUpdatedTasks],
	)
	const addTask = useCallback(
		(task: TaskWithUser) => {
			if (task.user.email === auth?.email) {
				return
			}
			setUpdatedTasks((draft) => {
				draft[task.id] = task
			})
		},
		[setUpdatedTasks],
	)
	const tasks = useTasks({
		onCreate: addTask,
		onDelete: removeTask,
	})

	useEffect(() => {
		if (tasks.list.data != null) {
			setUpdatedTasks((draft) => {
				Object.assign(draft, tasks.list.data)
			})
		}
	}, [tasks.list.data])

	if (tasks.list.isLoading || tasks.list.data == null) {
		return (
			<div className='flex flex-col gap-y-2'>
				<Progress className='w-56' value={0} />
				<Progress className='w-56' value={10} />
				<Progress className='w-56' value={40} />
				<Progress className='w-56' value={70} />
				<Progress className='w-56' value={100} />
			</div>
		)
	}

	return (
		<div className='overflow-x-scroll'>
			<table className='table w-full'>
				<thead>
					<tr>
						<th />
						<th>Task</th>
						<th>Author</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(updatedTasks)
						.sort(([, taskA], [, taskB]) => {
							return taskA.createdAt > taskB.createdAt ? -1 : 1
						})
						.map(([id, task], i) => {
							return (
								<tr key={id}>
									<td>{i + 1}</td>
									<td>
										<strong>{task.name}</strong>
									</td>
									<td>{task.user.email}</td>
									<td>
										{auth?.email === task.user.email ? (
											<Button
												onClick={() => {
													tasks.delete(task.id)
												}}
											>
												Delete
											</Button>
										) : (
											<Button disabled>None</Button>
										)}
									</td>
								</tr>
							)
						})}
				</tbody>
			</table>
		</div>
	)
}
