import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()
let envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  JWT_SECRET: z.string(),
  PORT: z.string(),
  SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
