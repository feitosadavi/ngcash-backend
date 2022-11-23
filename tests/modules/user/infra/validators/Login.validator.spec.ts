import { LoginValidator } from '@modules/user/infra/validators'

describe('LoginValidator', () => {
	let sut: LoginValidator

	beforeAll(() => {
		sut = new LoginValidator()
	})

	describe('username field', () => {
		it('should return an error if the field is missing', () => {
			const error = sut.validate({ password: 'Any' })
			expect(error).toBe('"username" is required')
		})
	})

	describe('password field', () => {
		it('should return an error if the field is missing', () => {
			const error = sut.validate({ username: 'any_username' })
			expect(error).toBe('"password" is required')
		})
	})

})