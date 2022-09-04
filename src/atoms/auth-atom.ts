import { atom, useAtom } from 'jotai'
import { trpc } from '../lib/trpc'

export const authAtom = atom({
  email: localStorage.getItem('email') || (null as string | null),
})

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom)
  const logoutMutation = trpc.useMutation('user.logout')
  const loginMutation = trpc.useMutation('user.login')

  return {
    email: auth.email,
    login: (email: string) => {
      setAuth({ email })

      loginMutation
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
    logout: () => {
      if (!auth.email) {
        return
      }

      localStorage.removeItem('email')
      logoutMutation
        .mutateAsync({
          email: auth.email,
        })
        .then(() => {
          setAuth({ email: null })
        })

      setAuth({ email: null })
    },
  }
}
