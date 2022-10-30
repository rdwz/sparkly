import type { TRPCLink } from '@trpc/client'
import { httpLink } from '@trpc/client/links/httpLink'
import { useMemo, useState } from 'react'
import { useAsync } from 'react-use'
import { trpc } from './trpc'

export const useTrpc = () => {
	const [trpcLinks, setTrpcLinks] = useState<
		| undefined
		| {
				splitLink: any
				createWSClient: any
				wsLink: any
		  }
	>()
	useAsync(async () => {
		const { splitLink } = await import('@trpc/client/links/splitLink')
		const { createWSClient, wsLink } = await import('@trpc/client/links/wsLink')

		setTrpcLinks({
			splitLink,
			createWSClient,
			wsLink,
		})
	}, [])

	const trpcClient = useMemo(() => {
		if (trpcLinks == null) {
			return trpc.createClient({
				links: [httpLink({ url: `${import.meta.env.VITE_SERVER_URL}/trpc` })],
			})
		}

		const wsClient = trpcLinks.createWSClient({
			url: `${import.meta.env.VITE_SERVER_URL.replace('http', 'ws')}/trpc`,
		})

		const links: Array<TRPCLink<any>> = [
			trpcLinks.splitLink({
				condition: (op: any) => op.type === 'subscription',
				true: trpcLinks.wsLink({ client: wsClient }),
				false: httpLink({ url: `${import.meta.env.VITE_SERVER_URL}/trpc` }),
			}),
		]

		return trpc.createClient({
			links,
		})
	}, [trpcLinks])

	return trpcClient
}
