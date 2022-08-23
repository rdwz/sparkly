import { useState } from 'react'
import { Button, Input } from 'react-daisyui'
import { trpc } from '../lib/trpc'

export const Home = () => {
  const [email, setEmail] = useState('')
  const loginMutation = trpc.useMutation(['users.login'])
  const getUsersQuery = trpc.useQuery(['users.list'])

  return (
    <main className='container mx-auto grid grid-cols-1 gap-2'>
      <h1 className='text-center text-2xl'>Fastify - React</h1>

      <div className='flex'>
        <div className='flex-1'>
          <form
            onSubmit={(e) => {
              e.preventDefault()

              loginMutation.mutateAsync(email).then((data) => {
                console.log(data.token)
              })
            }}
          >
            <Input
              value={email}
              type='email'
              placeholder='Type your email'
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
            <Button>Login</Button>
          </form>
        </div>
        <div className='flex-1'>
          {JSON.stringify(getUsersQuery?.data, null, 2)}
        </div>
      </div>
    </main>
  )
}
