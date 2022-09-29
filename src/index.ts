import { createServer } from './create-server.js'
import { env } from './env.js'

const server = await createServer()

await server.listen({ port: +env.PORT, host: '0.0.0.0' }).then((data) => {
	console.log(`Server running on ${data}`)
})
