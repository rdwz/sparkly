import type { TRPCLink } from '@trpc/client'
import { createWSClient, httpLink, splitLink, wsLink } from '@trpc/client'
import { useMemo } from 'react'
import { trpcReact } from './trpc-react'

const getServerUrl = (): string => {
	if (typeof window !== 'undefined') {
		return window.location.origin
	}

	return process.env['SERVER_URL'] as string
}

export const useTrpc = () => {
	const trpcClient = useMemo(() => {
		const serverUrl = getServerUrl()

		if (typeof window === 'undefined') {
			return trpcReact.createClient({
				links: [httpLink({ url: `${serverUrl}/trpc` })],
			})
		}

		const wsClient = createWSClient({
			url: `${serverUrl.replace(
				window.location.protocol,
				window.location.protocol === 'https:' ? 'wss:' : 'ws:',
			)}/trpc`,
		})

		const links: Array<TRPCLink<any>> = [
			splitLink({
				condition: (op: any) => op.type === 'subscription',
				true: wsLink({ client: wsClient }),
				false: httpLink({ url: `${serverUrl}/trpc` }),
			}),
		]

		return trpcReact.createClient({
			links,
		})
	}, [])

	return trpcClient
}
