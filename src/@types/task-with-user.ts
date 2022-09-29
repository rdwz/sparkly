import type { Task, User } from '@prisma/client'

export type TaskWithUser = Task & {
	user: User
}
