import appRoot from 'app-root-path'
import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fs from 'fs'
import path from 'path'
// import * as url from 'url'
import { env } from '../env.js'

const templatePath = path.join(appRoot.path, 'index.html')

type ReactSSROptions = {
	template: string
}

const renderForDev = async (server: FastifyInstance) => {
	const template = fs.readFileSync(templatePath, 'utf-8')

	const { createViteServer } = await import('../create-vite-server.js')
	const vite = await createViteServer()
	await server.use(vite.middlewares)

	server.get('*', async (req, reply) => {
		const transformed = await vite.transformIndexHtml(req.url, template)
		const render = (await vite.ssrLoadModule('/src/entry-server.tsx'))['render']
		const appHtml = render(req.url)

		if (appHtml === '') {
			return await reply.redirect('/not-found')
		}

		const html = transformed.replace('<!--ssr-outlet-->', appHtml)
		return await reply.status(200).type('text/html').send(html)
	})
}

const renderForProd = async (server: FastifyInstance) => {
	const template = fs.readFileSync(
		path.join(appRoot.path, 'dist/client/index.html'),
		'utf-8',
	)
	await server.register((await import('@fastify/compress')).default)
	await server.register((await import('@fastify/static')).default, {
		root: path.join(appRoot.path, 'dist/client/assets'),
		prefix: '/assets',
	})

	server.get('*', async (req, reply) => {
		// @ts-expect-error
		const render = (await import('../server/entry-server.js')).render
		const appHtml = render(req.url)

		if (appHtml === '') {
			return await reply.redirect('/not-found')
		}

		const html = template.replace('<!--ssr-outlet-->', appHtml)

		return await reply.status(200).type('text/html').send(html)
	})
}

export const reactSSR = fastifyPlugin<ReactSSROptions>(
	async (server: FastifyInstance) => {
		if (env.NODE_ENV === 'production') {
			await renderForProd(server)
		} else {
			await renderForDev(server)
		}
	},
)
