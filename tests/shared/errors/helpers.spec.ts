import { UsernameAlreadyExistsError } from '@shared/errors'
import { forbidden, processErrors, serverError } from '@shared/errors/helpers'

describe('processErrors', () => {
	it('should return matchedError if error matches', () => {
		const processedErrors = processErrors(new UsernameAlreadyExistsError(), [{
			possibleErrorName: UsernameAlreadyExistsError.name,
			return: forbidden(new UsernameAlreadyExistsError())
		}])
		expect(processedErrors).toEqual(forbidden(new UsernameAlreadyExistsError()))
	})

	it('should return serverError if none errors have matched', () => {
		const error = new Error('any_error')

		const processedErrors = processErrors(error, [{
			possibleErrorName: 'NonExistentError',
			return: {}
		}])

		expect(processedErrors).toEqual(serverError(error))
	})
})