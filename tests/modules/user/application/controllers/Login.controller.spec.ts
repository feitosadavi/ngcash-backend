import { LoginController } from '@modules/user/application/controllers/Login.controller'
import { IValidator } from '@shared/data/adapters'
import { mock, MockProxy } from 'jest-mock-extended'


const makeFakeRequest = (): LoginController.Req => ({
	username: 'any_username',
	password: 'any_password'
})

describe('LoginController', () => {
	let sut: LoginController

	let fakeValidator: MockProxy<IValidator>

	let fakeRequest: LoginController.Req

	beforeAll(() => {
		fakeValidator = mock()
		fakeValidator.validate.mockReturnValue(null)

		sut = new LoginController(fakeValidator)

		fakeRequest = makeFakeRequest()
	})

	it('should call validator with correct input', async () => {
		await sut.handle(fakeRequest)
		expect(fakeValidator.validate).toHaveBeenCalledWith(fakeRequest)
	})
})