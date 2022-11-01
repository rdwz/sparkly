import { createServer } from './create-server.js'
import { env } from './env.js'

const server = await createServer()

try {
	await server.listen({ port: +env.PORT, host: '0.0.0.0' })
} catch (error) {
	if (error instanceof Error) {
		console.error(error)
		process.exit(1)
	}
}
