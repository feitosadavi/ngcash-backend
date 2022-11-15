export type ErrorInfo = {
	name: string
	message: string
}

export const USERNAME_ALREADY_EXISTS: ErrorInfo = {
	name: 'UsernameAlreadyExistsError',
	message: 'A user with inserted username already exists'
}

export class AppError extends Error {
	constructor({ name, message }: ErrorInfo) {
		super(message)
		this.name = name
	}
}