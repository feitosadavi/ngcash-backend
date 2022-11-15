export type ErrorInfo = {
	name: string
	message: string
	stack?: any
}

export const USERNAME_ALREADY_EXISTS: ErrorInfo = {
	name: 'UsernameAlreadyExistsError',
	message: 'A user with inserted username already exists'
}

export const INTERNAL_SERVER_ERROR: ErrorInfo = {
	name: 'InternalServerError',
	message: 'A Internal Server Error has ocurred. Sorry!'
}

export class AppError extends Error {
	constructor({ name, message, stack }: ErrorInfo) {
		super(message)
		this.name = name
		this.stack = stack
	}
}