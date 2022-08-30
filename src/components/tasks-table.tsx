import { Progress } from 'react-daisyui'
import { useTasks } from '../atoms/tasks-atom'

export const TasksTable = () => {
  const { tasks, query } = useTasks()

  if (query.isLoading || !query.data) {
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
    <table className='table w-full'>
      <thead>
        <tr>
          <th />
          <th>Name</th>
          <th>Author</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(tasks)
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
                <td>{task.completed}</td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
