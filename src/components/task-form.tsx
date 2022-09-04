import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'
import { Button, Form, Input } from 'react-daisyui'
import { authAtom } from '../atoms/auth-atom'
import { tasksAtom, useTasks } from '../atoms/tasks-atom'

const taskFormAtom = atomWithImmer({
  name: '',
})

export const TaskForm = () => {
  const [task, setTask] = useAtom(taskFormAtom)
  const [, setTasks] = useAtom(tasksAtom)
  const [auth] = useAtom(authAtom)
  const tasks = useTasks()

  if (!auth.email) {
    return null
  }

  return (
    <form
      className='form-control'
      onSubmit={(e) => {
        e.preventDefault()

        tasks.create(task).then((data) => {
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
