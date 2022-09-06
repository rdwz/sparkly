import { atom, useAtom } from 'jotai'
import { useAsync } from 'react-use'
import { trpc } from '../lib/trpc'

export const authAtom = atom({
  email: localStorage.getItem('email') ?? (null as string | null),
})

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom)
  const logoutMutation = trpc.useMutation('user.logout')
  const loginMutation = trpc.useMutation('user.login')

  useAsync(async () => {
    if (auth.email !== null) {
      await loginMutation.mutateAsync({
        email: auth.email,
      })
    }
  }, [])

  return {
    email: auth.email,
    login: async (email: string) => {
      setAuth({ email })

      return await loginMutation
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

      return await logoutMutation
        .mutateAsync({
          email: auth.email,
        })
        .then(() => {
          setAuth({ email: null })
        })
    },
  }
}
