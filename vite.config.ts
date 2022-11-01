import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())

	return {
		plugins: [
			react(),
			createHtmlPlugin({
				minify: true,
				inject: {
					data: {
						SITE_NAME: env.VITE_SITE_NAME,
						GOOGLE_VERIFICATION_ID: env.VITE_GOOGLE_VERIFICATION_ID,
					},
				},
			}),
		],
		build: {
			minify: false,
		},
	}
})
