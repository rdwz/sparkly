import { httpLink } from '@trpc/client/links/httpLink'
import { splitLink } from '@trpc/client/links/splitLink'
import { createWSClient, wsLink } from '@trpc/client/links/wsLink'

import { useMemo } from 'react'
import { trpc } from './trpc'

export const useTrpc = () => {
	const trpcClient = useMemo(() => {
		const wsClient = createWSClient({
			url: `${import.meta.env.VITE_SERVER_URL.replace('http', 'ws')}/trpc`,
		})
		return trpc.createClient({
			links: [
				splitLink({
					condition: (op) => op.type === 'subscription',
					true: wsLink({ client: wsClient }),
					false: httpLink({ url: `${import.meta.env.VITE_SERVER_URL}/trpc` }),
				}),
			],
		})
	}, [])

	return trpcClient
}
