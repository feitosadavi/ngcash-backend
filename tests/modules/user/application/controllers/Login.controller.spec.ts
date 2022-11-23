import { LoginController } from '@modules/user/application/controllers/Login.controller'
import { IAuthenticatorService } from '@modules/user/domain/contracts'
import { IValidator } from '@shared/data/adapters'
import { ValidationError, WrongPasswordError, WrongUsernameError } from '@shared/errors'
import { badRequest, serverError, success } from '@shared/errors/helpers'
import { throwError } from '@tests/helpers'
import { mock, MockProxy } from 'jest-mock-extended'


const makeFakeRequest = (): LoginController.Req => ({
	username: 'any_username',
	password: 'any_password'
})

describe('LoginController', () => {
	let sut: LoginController

	let fakeValidator: MockProxy<IValidator>
	let fakeAuthenticator: MockProxy<IAuthenticatorService>

	let fakeRequest: LoginController.Req

	beforeAll(() => {
		fakeValidator = mock()
		fakeValidator.validate.mockReturnValue(null)

		fakeAuthenticator = mock()
		fakeAuthenticator.execute.mockResolvedValue({ accessToken: 'any_access_token', id: 'any_id' })

		sut = new LoginController(fakeValidator, fakeAuthenticator)

		fakeRequest = makeFakeRequest()
	})

	it('should call validator with correct input', async () => {
		await sut.handle(fakeRequest)
		expect(fakeValidator.validate).toHaveBeenCalledWith(fakeRequest)
	})

	it('should return 400 returns an error message', async () => {
		const errorMsg = 'any_error_msg'

		fakeValidator.validate.mockReturnValueOnce(errorMsg)

		const res = await sut.handle(fakeRequest)

		expect(res).toEqual(badRequest(new ValidationError(errorMsg)))
	})

	it('should call authenticator with correct input', async () => {
		await sut.handle(fakeRequest)
		expect(fakeAuthenticator.execute).toHaveBeenCalledWith(fakeRequest)
	})

	it('should return 200 on success', async () => {
		const res = await sut.handle(fakeRequest)

		expect(res).toEqual(success({ accessToken: 'any_access_token', id: 'any_id' }))
	})

	it('should return 400 if authenticator throws WrongUsernameError', async () => {
		fakeAuthenticator.execute.mockImplementationOnce(() => { throw new WrongUsernameError() })

		const res = await sut.handle(fakeRequest)

		expect(res).toEqual(badRequest(new WrongUsernameError()))
	})

	it('should return 400 if authenticator throws WrongPasswordError', async () => {
		fakeAuthenticator.execute.mockImplementationOnce(() => { throw new WrongPasswordError() })

		const res = await sut.handle(fakeRequest)

		expect(res).toEqual(badRequest(new WrongPasswordError()))
	})

	it('should return 500 if some unknown error throws', async () => {
		fakeValidator.validate.mockImplementationOnce(throwError)

		const res = await sut.handle(fakeRequest)

		expect(res).toEqual(serverError())
	})
})