import { useState } from 'react'
import { Button, Input, InputGroup } from 'react-daisyui'
import * as authAtom from '../atoms/auth-atom'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const auth = authAtom.useAuth()

  if (auth.email !== null) {
    return (
      <form
        className='portrait:w-full'
        onSubmit={async (e) => {
          e.preventDefault()

          return await auth.logout()
        }}
      >
        <Button type='submit' className='portrait:w-full'>
          Logout user {auth.email}
        </Button>
      </form>
    )
  }

  return (
    <form
      className='w-full'
      onSubmit={async (e) => {
        e.preventDefault()

        return await auth.login(email)
      }}
    >
      <InputGroup className='w-full flex'>
        <Input
          value={email}
          type='email'
          placeholder='Type your email'
          required
          className='flex-1'
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <Button className='btn-primary'>Login</Button>
      </InputGroup>
    </form>
  )
}
