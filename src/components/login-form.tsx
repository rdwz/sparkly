import { useState } from 'react'
import { Button, Input } from 'react-daisyui'
import * as authAtom from '../atoms/auth-atom'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const auth = authAtom.useAuth()

  if (auth.email) {
    return (
      <form
        className='flex flex-row'
        onSubmit={(e) => {
          e.preventDefault()

          return auth.logout()
        }}
      >
        <Button type='submit'>Logout user {auth.email}</Button>
      </form>
    )
  }

  return (
    <form
      className='flex flex-row'
      onSubmit={(e) => {
        e.preventDefault()

        return auth.login(email)
      }}
    >
      <Input
        value={email}
        type='email'
        placeholder='Type your email'
        required
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
      <Button>Login</Button>
    </form>
  )
}
