import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { trpc } from '../lib/trpc'

export const authAtom = atom({
  email: localStorage.getItem('email') || (null as string | null),
})

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom)
  const logoutMutation = trpc.useMutation('user.logout')
  const loginMutation = trpc.useMutation('user.login')

  useEffect(() => {
    if (auth.email) {
      loginMutation
        .mutateAsync({
          email: auth.email,
        })
        .then((data) => {
          localStorage.setItem('email', data.email)

          setAuth({
            email: data.email,
          })
        })
    } else {
      localStorage.removeItem('email')
      logoutMutation.mutateAsync().then(() => {
        setAuth({ email: null })
      })
    }
  }, [auth.email])

  return {
    email: auth.email,
    login: (email: string) => {
      setAuth({ email })
    },
    logout: () => {
      setAuth({ email: null })
    },
  }
}
