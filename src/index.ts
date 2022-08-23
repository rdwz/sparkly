import { createServer } from './create-server.js'
import { env } from './env.js'

const server = await createServer()

server.listen({ port: +env.PORT }).then((data) => {
  console.log(`Server running on ${data}`)
})
