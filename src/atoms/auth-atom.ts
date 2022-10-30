import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { trpcReact } from '../lib/trpc-react.js'

export const authAtom = atom({
	email: null as string | null,
})

export const useAuth = () => {
	const [auth, setAuth] = useAtom(authAtom)
	const logoutMutation = trpcReact.user.logout.useMutation()
	const loginMutation = trpcReact.user.login.useMutation()

	useEffect(() => {
		if (auth.email !== null) {
			loginMutation.mutate({
				email: auth.email,
			})
		}
	}, [])

	return {
		email: auth.email,
		login: async (email: string) => {
			setAuth({ email })

			return loginMutation
				.mutateAsync({
					email,
				})
				.then((data) => {
					localStorage.setItem('email', data.email)

					setAuth({
						email: data.email,
					})
				})
		},
		logout: async () => {
			if (auth.email === null) {
				return
			}

			localStorage.removeItem('email')

			return logoutMutation
				.mutateAsync({
					email: auth.email,
				})
				.then(() => {
					setAuth({ email: null })
				})
		},
	}
}
