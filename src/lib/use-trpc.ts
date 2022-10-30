import type { TRPCLink } from '@trpc/client'
import { createWSClient, httpLink, splitLink, wsLink } from '@trpc/client'

import { useMemo } from 'react'
import { trpcReact } from './trpc-react'

export const useTrpc = () => {
	const trpcClient = useMemo(() => {
		if (typeof window === 'undefined') {
			return trpcReact.createClient({
				links: [httpLink({ url: `${import.meta.env.VITE_SERVER_URL}/trpc` })],
			})
		}

		const wsClient = createWSClient({
			url: `${import.meta.env.VITE_SERVER_URL.replace('http', 'ws')}/trpc`,
		})

		const links: Array<TRPCLink<any>> = [
			splitLink({
				condition: (op: any) => op.type === 'subscription',
				true: wsLink({ client: wsClient }),
				false: httpLink({ url: `${import.meta.env.VITE_SERVER_URL}/trpc` }),
			}),
		]

		return trpcReact.createClient({
			links,
		})
	}, [])

	return trpcClient
}
