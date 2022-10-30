import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import middie from '@fastify/middie'
import fastifySession from '@fastify/session'
import ws from '@fastify/websocket'
import {
	CreateFastifyContextOptions,
	fastifyTRPCPlugin,
} from '@trpc/server/adapters/fastify'

import fastify from 'fastify'
import fs from 'fs'
import path from 'path'
import * as url from 'url'
import type { ViteDevServer } from 'vite'
import { createViteServer } from './create-vite-server.js'
import { env as defaultEnv } from './env.js'
import * as context from './lib/create-context.js'
import { appRouter } from './router/index.js'

const currentPath = url.fileURLToPath(new URL('.', import.meta.url))
const rootPath = path.join(currentPath, '..')

const envToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	},
	production: true,
	test: false,
}

export const createServer = async (env = defaultEnv) => {
	const server = fastify({
		maxParamLength: 5000,
		logger: envToLogger[env.NODE_ENV],
	})

	const fastifyCookieOptions: FastifyCookieOptions = {
		secret: env.SECRET,
	}

	await server.register(cookie, fastifyCookieOptions)
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	await server.register(fastifySession, {
		cookieName: 'sessionId',
		secret: env.SECRET,
		cookie: {
			secure: env.NODE_ENV === 'production',
			expires: tomorrow,
		},
	})

	await server.register(middie)

	let vite: ViteDevServer

	if (env.NODE_ENV !== 'production') {
		vite = await createViteServer()
		await server.use(vite.middlewares)
	} else {
		await server.register((await import('@fastify/compress')).default)
		await server.register((await import('@fastify/static')).default, {
			root: path.join(rootPath, 'dist/client/assets'),
			prefix: '/assets',
		})
	}

	await server.register(ws)
	await server.register(fastifyTRPCPlugin, {
		useWSS: true,
		prefix: '/trpc',
		trpcOptions: {
			router: appRouter,
			createContext: async (args: CreateFastifyContextOptions) => {
				const value = await context.createContext(args)

				return value
			},
		},
	})

	server.get('*', async (req, reply) => {
		let template: string = ''
		let render: any

		if (env.NODE_ENV !== 'production') {
			template = fs.readFileSync(
				path.resolve(currentPath, '..', 'index.html'),
				'utf-8',
			)
			template = await vite.transformIndexHtml(req.url, template)
			render = (await vite.ssrLoadModule('/src/entry-server.tsx'))['render']
		} else {
			template = fs.readFileSync(
				path.join(rootPath, 'dist/client/index.html'),
				'utf-8',
			)

			// @ts-expect-error
			render = (await import('./server/entry-server.js')).render
		}

		const appHtml = render(url)

		// if (context.url) {
		// 	// Somewhere a `<Redirect>` was rendered
		// 	return res.redirect(301, context.url)
		// }

		const html = template.replace('<!--ssr-outlet-->', appHtml)

		return await reply.status(200).type('text/html').send(html)
	})

	return await server
}
