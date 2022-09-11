import z from 'zod'

const envSchema = z.object({
  VITE_GITHUB_URL: z.string(),
})

export const viteEnv = envSchema.parse(import.meta.env)
