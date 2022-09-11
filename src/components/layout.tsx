import { Link, Navbar } from 'react-daisyui'
import { PageLink } from '../components/page-link'
import { viteEnv } from '../vite-env'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = (props: LayoutProps) => {
  return (
    <main className='container mx-auto grid grid-cols-1 gap-2 p-2'>
      <Navbar>
        <Navbar.Start>
          <PageLink to='/' className='link link-neutral hover:no-underline'>
            <h1 className='text-center text-xl text-primary'>
              Fastify-React-TS
            </h1>
          </PageLink>
        </Navbar.Start>
        <Navbar.End className='text-secondary grid grid-flow-col gap-2'>
          <PageLink to='/about'>About</PageLink>
          <Link href={viteEnv.VITE_GITHUB_URL} target='_blank'>
            GitHub
          </Link>
        </Navbar.End>
      </Navbar>

      {props.children}
    </main>
  )
}
