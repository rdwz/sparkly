import { Link, Navbar } from 'react-daisyui'
import { useAuth } from '../atoms/auth-atom'
import { LoginForm } from '../components/login-form'
import { TaskForm } from '../components/task-form'
import { TasksTable } from '../components/tasks-table'
export const Home = () => {
  useAuth()

  return (
    <main className='container mx-auto grid grid-cols-1 gap-2 pr-1 pl-1'>
      <Navbar>
        <Navbar.Start>
          <LoginForm />
        </Navbar.Start>
        <Navbar.Center>
          <h1 className='text-center text-2xl'>Fastify - React</h1>
        </Navbar.Center>
        <Navbar.End>
          <Link href='https://fastify-react-ts.fly.dev' target='_blank'>
            GitHub
          </Link>
        </Navbar.End>
      </Navbar>

      <TaskForm />
      <TasksTable />
    </main>
  )
}
