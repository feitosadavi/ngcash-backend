import { CreateUserValidator, passwordRule } from '@modules/user/infra/validators'

describe('CreateUserValidator', () => {
	let sut: CreateUserValidator

	beforeAll(() => {
		sut = new CreateUserValidator()
	})

	describe('username field', () => {
		it('should return an error if the field is missing', () => {
			const error = sut.validate({ password: 'Any' })
			expect(error).toBe('"username" is required')
		})
		it('should return an error if the field type is wrong', () => {
			const error = sut.validate({ username: 1, password: 'Any' })
			expect(error).toBe('"username" must be a string')
		})
		it('should return an error if the field length is lesser than 3 chars', () => {
			const error = sut.validate({ username: 'ab', password: 'Any' })
			expect(error).toBe('"username" length must be at least 3 characters long')
		})
	})

	describe('password field', () => {
		it('should return an error if the field is missing', () => {
			const error = sut.validate({ username: 'any_username' })
			expect(error).toBe('"password" is required')
		})
		it('should return an error if the field type is wrong', () => {
			const error = sut.validate({ username: 'any_username', password: 1 })
			expect(error).toBe('"password" must be a string')
		})
		it('should return an error if the field length is lesser than 8 chars', () => {
			const error = sut.validate({ username: 'any_username', password: '1234567' })
			expect(error).toBe('"password" length must be at least 8 characters long')
		})
		it('should return an error if the field has no uppercase letters', () => {
			const error = sut.validate({ username: 'any_username', password: '12345678d' })
			expect(error).toBe(passwordRule.message)
		})
		it('should return an error if the field has no digits', () => {
			const error = sut.validate({ username: 'any_username', password: 'ABCEDEFG' })
			expect(error).toBe(passwordRule.message)
		})
	})

})