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

export class WrongUsernameError extends Error {
	constructor() {
		super('No user with this username was found!')
		this.name = 'WrongUsernameError'
	}
}

export class WrongPasswordError extends Error {
	constructor() {
		super('This password doesnt matches with username!')
		this.name = 'WrongPasswordError'
	}
}

export class ValidationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'ValidationError'
	}
}