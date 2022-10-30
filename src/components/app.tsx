import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '../atoms/auth-atom'
import { trpcReact } from '../lib/trpc-react'
import { useTrpc } from '../lib/use-trpc.js'
import { Pages } from '../pages'

const queryClient = new QueryClient()

interface AuthProps {
	children: React.ReactNode
}

const Auth = (props: AuthProps) => {
	useAuth()

	return <>{props.children}</>
}

export const App = () => {
	const trpcClient = useTrpc()
	return (
		<trpcReact.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<Auth>
					<Pages />
				</Auth>
			</QueryClientProvider>
		</trpcReact.Provider>
	)
}
