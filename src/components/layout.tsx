import { Link, Navbar } from 'react-daisyui'
import { PageLink } from '../components/page-link'

interface LayoutProps {
	children: React.ReactNode
}

export const Layout = (props: LayoutProps) => {
	return (
		<main className='container mx-auto grid grid-cols-1 gap-2 p-2'>
			<Navbar>
				<Navbar.Start>
					<PageLink to='/' className='link-neutral link hover:no-underline'>
						<h1 className='text-center text-xl text-primary'>
							Fastify-React-TS
						</h1>
					</PageLink>
				</Navbar.Start>
				<Navbar.End className='grid grid-flow-col gap-2 text-secondary'>
					<PageLink to='/about'>About</PageLink>
					<Link
						href='https://github.com/giacomorebonato/fastify-react-ts'
						target='_blank'
					>
						GitHub
					</Link>
				</Navbar.End>
			</Navbar>

			{props.children}
		</main>
	)
}
