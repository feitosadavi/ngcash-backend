import { AppError, USERNAME_ALREADY_EXISTS } from '@shared/errors'
import { forbidden, processErrors, serverError } from '@shared/errors/helpers'

describe('processErrors', () => {
	it('should return serverError if error isn`t instance of AppError', () => {
		const processedErrors = processErrors(new Error(), [])
		expect(processedErrors).toEqual(serverError())
	})

	it('should return matchedError if error matches', () => {
		const processedErrors = processErrors(new AppError(USERNAME_ALREADY_EXISTS), [{
			possibleErrorName: USERNAME_ALREADY_EXISTS.name,
			return: forbidden(new AppError(USERNAME_ALREADY_EXISTS))
		}])
		expect(processedErrors).toEqual(forbidden(new AppError(USERNAME_ALREADY_EXISTS)))
	})

	it('should return serverError if none errors have matched', () => {
		const processedErrors = processErrors(new AppError(USERNAME_ALREADY_EXISTS), [{
			possibleErrorName: 'NonExistentError',
			return: {}
		}])
		expect(processedErrors).toEqual(serverError())
	})
})