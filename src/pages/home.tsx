import { Layout } from '../components/layout'
import { TaskForm } from '../components/task-form'
import { TasksTable } from '../components/tasks-table'

export const Home = () => {
  return (
    <Layout>
      <TaskForm />
      <TasksTable />
    </Layout>
  )
}
