export class InternalServerError extends Error {
	constructor(stack?: any) {
		super('A Internal Server Error has ocurred. Sorry!')
		this.name = 'InternalServerError'
		this.stack = stack
	}
}

export class UsernameAlreadyExistsError extends Error {
	constructor() {
		super('A user with inserted username already exists')
		this.name = 'UsernameAlreadyExistsError'
	}
}

export class ValidationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'ValidationError'
	}
}