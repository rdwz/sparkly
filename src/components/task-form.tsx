import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { Button, Form, Input } from 'react-daisyui'
import { authAtom } from '../atoms/auth-atom'
import { tasksAtom } from '../atoms/tasks-atom'
import { trpc } from '../lib/trpc'

const taskFormAtom = atomWithImmer({
  name: '',
  completed: false,
})

export const TaskForm = () => {
  const [task, setTask] = useAtom(taskFormAtom)
  const [, setTasks] = useAtom(tasksAtom)
  const [auth] = useAtom(authAtom)
  const createTask = trpc.useMutation('task.create')

  if (!auth.email) {
    return null
  }

  return (
    <form
      className='form-control'
      onSubmit={(e) => {
        e.preventDefault()

        createTask.mutateAsync(task).then((data) => {
          setTasks((draft) => {
            draft[data.id] = data
          })
        })
      }}
    >
      <Form.Label title='Task name'>
        <Input
          value={task.name}
          required
          onChange={(e) => {
            setTask((draft) => {
              draft.name = e.target.value
            })
          }}
        />
      </Form.Label>
      <Button type='submit'>Create</Button>
    </form>
  )
}
