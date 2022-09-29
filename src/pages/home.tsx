import { Layout } from '../components/layout'
import { LoginForm } from '../components/login-form'
import { TaskForm } from '../components/task-form'
import { TasksTable } from '../components/tasks-table'

export const Home = () => {
	return (
		<Layout>
			<LoginForm />
			<TaskForm />
			<TasksTable />
		</Layout>
	)
}
