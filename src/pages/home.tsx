import { Link, Navbar } from 'react-daisyui'
import { useAuth } from '../atoms/auth-atom'
import { LoginForm } from '../components/login-form'
import { TaskForm } from '../components/task-form'
import { TasksTable } from '../components/tasks-table'

const GITHUB_URL = 'https://github.com/giacomorebonato/fastify-react-ts'

export const Home = () => {
  useAuth()

  return (
    <main className='container mx-auto grid grid-cols-1 gap-2 pr-1 pl-1'>
      <Navbar>
        <Navbar.Start>
          <h1 className='text-center text-xl text-primary'>Fastify-React-TS</h1>
        </Navbar.Start>
        <Navbar.End className='text-secondary'>
          <Link href={GITHUB_URL} target='_blank'>
            GitHub
          </Link>
        </Navbar.End>
      </Navbar>

      <LoginForm />

      <TaskForm />
      <TasksTable />
    </main>
  )
}
