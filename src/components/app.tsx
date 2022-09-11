import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../atoms/auth-atom'
import { trpc } from '../lib/trpc'
import { useTrpc } from '../lib/use-trpc'
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
    <BrowserRouter>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Auth>
            <Pages />
          </Auth>
        </QueryClientProvider>
      </trpc.Provider>
    </BrowserRouter>
  )
}
