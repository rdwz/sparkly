import path from 'path'
import * as url from 'url'
import { createServer } from 'vite'
import { env } from './env.js'

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url))

const root = path.join(currentDirectory, '..')

export const createViteServer = async () => {
	const vite = await createServer({
		root,
		logLevel: env.NODE_ENV === 'test' ? 'error' : 'info',
		server: {
			middlewareMode: true,
			watch: {
				usePolling: true,
				interval: 100,
			},
		},
		appType: 'custom',
	})

	return vite
}
