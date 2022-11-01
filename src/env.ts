import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envSchema = z.object({
	SERVER_URL: z.string().default('http://localhost:3000'),
	NODE_ENV: z
		.enum(['production', 'development', 'test'])
		.default('development'),
	JWT_SECRET: z.string().default('random-jwt-secret'),
	PORT: z.string().default('3000'),
	SECRET: z.string().default('a secret with minimum length of 32 characters'),
})

export const env = envSchema.parse(process.env)
