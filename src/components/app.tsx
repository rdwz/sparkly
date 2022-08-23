import { QueryClient, QueryClientProvider } from 'react-query'
import { trpc } from '../lib/trpc'
import { Home } from '../pages/home'

const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
  url: `${import.meta.env.VITE_SERVER_URL}/trpc`,
})

export const App = () => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
