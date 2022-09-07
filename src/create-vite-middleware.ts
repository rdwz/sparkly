import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const rootPath = fileURLToPath(new URL('../', import.meta.url))

export const createViteMiddleware = async () => {
  const vite = await createServer({
    build: {
      minify: 'esbuild',
      ssr: false,
      sourcemap: true,
    },
    server: {
      middlewareMode: true,
    },
    root: rootPath,
    appType: 'spa',
  })

  return vite.middlewares
}
