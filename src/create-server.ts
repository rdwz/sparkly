import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import middie from '@fastify/middie'
import fastifySession from '@fastify/session'
import fastifyWebsocket from '@fastify/websocket'
import {
	CreateFastifyContextOptions,
	fastifyTRPCPlugin,
} from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { env as defaultEnv } from './env.js'
import { reactSSR } from './fastify-plugins/react-ssr.js'
import * as context from './lib/create-context.js'
import { appRouter } from './router/index.js'

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

const makeTomorrowDate = () => {
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	return tomorrow
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
	await server.register(fastifySession, {
		cookieName: 'sessionId',
		secret: env.SECRET,
		cookie: {
			secure: env.NODE_ENV === 'production',
			expires: makeTomorrowDate(),
		},
	})

	await server.register(middie)
	await server.register(fastifyWebsocket)
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

	await server.register(reactSSR)

	return await server
}
