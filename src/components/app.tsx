import { QueryClient, QueryClientProvider } from 'react-query'
import { trpc } from '../lib/trpc'
import { useTrpc } from '../lib/use-trpc'
import { Home } from '../pages/home'

const queryClient = new QueryClient()

export const App = () => {
  const trpcClient = useTrpc()
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
