import { Link, Navbar } from 'react-daisyui'
import { useAuth } from '../atoms/auth-atom'
import { LoginForm } from '../components/login-form'
import { TaskForm } from '../components/task-form'
import { TasksTable } from '../components/tasks-table'
export const Home = () => {
  useAuth()

  return (
    <main className='container mx-auto grid grid-cols-1 gap-2 pr-1 pl-1'>
      <section className='portrait:grid grid-cols-1 p-4 gap-2 hidden portrait:visible'>
        <h1 className='text-xl text-center'>Fastify-React-TS</h1>
        <div className='text-center'>
          <Link href='https://fastify-react-ts.fly.dev' target='_blank'>
            GitHub
          </Link>
        </div>
      </section>
      <Navbar>
        <Navbar.Start>
          <LoginForm />
        </Navbar.Start>
        <Navbar.Center className='portrait:hidden'>
          <h1 className='text-center text-xl'>Fastify-React-TS</h1>
        </Navbar.Center>
        <Navbar.End className='portrait:hidden'>
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
