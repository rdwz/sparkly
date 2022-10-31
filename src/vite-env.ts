import z from 'zod'

const envSchema = z.object({})

export const viteEnv = envSchema.parse(import.meta.env)
