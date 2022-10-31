import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fs from 'fs'
import path from 'path'
import * as url from 'url'
import type { ViteDevServer } from 'vite'
import { env } from '../env.js'

const currentPath = url.fileURLToPath(new URL('.', import.meta.url))
const rootPath = path.join(currentPath, '../..')

export const reactSSR = fastifyPlugin(async (server: FastifyInstance) => {
	let vite: ViteDevServer

	if (env.NODE_ENV !== 'production') {
		const { createViteServer } = await import('../create-vite-server.js')
		vite = await createViteServer()
		await server.use(vite.middlewares)
	} else {
		await server.register((await import('@fastify/compress')).default)
		await server.register((await import('@fastify/static')).default, {
			root: path.join(rootPath, 'dist/client/assets'),
			prefix: '/assets',
		})
	}

	server.get('*', async (req, reply) => {
		let template: string = ''
		let appHtml: string

		if (env.NODE_ENV !== 'production') {
			template = fs.readFileSync(
				path.resolve(currentPath, '..', '..', 'index.html'),
				'utf-8',
			)
			template = await vite.transformIndexHtml(req.url, template)
			const render = (await vite.ssrLoadModule('/src/entry-server.tsx'))[
				'render'
			]
			appHtml = render(url)
		} else {
			template = fs.readFileSync(
				path.join(rootPath, 'dist/client/index.html'),
				'utf-8',
			)

			// @ts-expect-error
			const render = (await import('../server/entry-server.js')).render
			appHtml = render(url)
		}

		// if (context.url) {
		// 	// Somewhere a `<Redirect>` was rendered
		// 	return res.redirect(301, context.url)
		// }

		const html = template.replace('<!--ssr-outlet-->', appHtml)

		return await reply.status(200).type('text/html').send(html)
	})
})
