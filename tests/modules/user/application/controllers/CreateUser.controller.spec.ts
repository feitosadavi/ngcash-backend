import { mock, MockProxy } from 'jest-mock-extended'
import { ICreateUserModel } from '@modules/user/domain/models'

import { IHasherAdapter } from '@shared/data/adapters/cryptography'
import { ICreateUserService } from '@modules/user/domain/contracts'
import { CreateUserController } from '@modules/user/application/controllers/CreateUser.controller'
import { InternalServerError, UsernameAlreadyExistsError, ValidationError } from '@shared/errors'
import { throwError } from '@tests/helpers'
import { badRequest, forbidden, serverError } from '@shared/errors/helpers'
import { IValidator } from '@shared/data/adapters'
import { makeFakeCreateUserModel } from '../../mocks/fakes'

const makeFakeRequest = (): CreateUserController.Req => ({
	body: makeFakeCreateUserModel()
})

describe('CreateUserController', () => {
	let sut: CreateUserController
	let fakeHasher: MockProxy<IHasherAdapter>
	let fakeCreateUserService: MockProxy<ICreateUserService>
	let fakeValidator: MockProxy<IValidator>

	let fakeCreateUserModel: ICreateUserModel
	// let fakeUserModel: IUserModel
	let fakeRequest: CreateUserController.Req

	beforeAll(() => {
		fakeHasher = mock()
		fakeHasher.hash.mockResolvedValue('hashed_password')

		fakeCreateUserService = mock()
		fakeCreateUserService.execute.mockResolvedValue(true)

		fakeValidator = mock()
		fakeValidator.validate.mockReturnValue(null)

		fakeCreateUserModel = makeFakeCreateUserModel()
		// fakeUserModel = makeFakeUserModel()
		fakeRequest = makeFakeRequest()
	})

	beforeEach(() => {
		sut = new CreateUserController(fakeValidator, fakeCreateUserService)
	})

	it('should call Validator with correct input', async () => {
		await sut.handle(fakeRequest)

		expect(fakeValidator.validate).toHaveBeenCalledWith(fakeRequest.body)
	})

	it('should call return 400 if Validator throws', async () => {
		const error = new ValidationError('any_error')

		fakeValidator.validate.mockImplementationOnce(() => { throw error })

		const res = await sut.handle(fakeRequest)

		expect(res).toEqual(badRequest(error))
	})

	it('should call CreateUserService with correct input', async () => {
		await sut.handle(fakeRequest)

		expect(fakeCreateUserService.execute).toHaveBeenCalledWith(fakeCreateUserModel)
	})

	it('should return 403 if CreateUserService throws USERNAME_ALREADY_EXISTS error', async () => {
		fakeCreateUserService.execute
			.mockImplementationOnce(() => throwError(new UsernameAlreadyExistsError()))

		const res = await sut.handle(fakeRequest)

		expect(res)
			.toEqual(forbidden(new UsernameAlreadyExistsError()))
	})

	it('should call return 500 if CreateUserService throws other errors', async () => {
		const error = new InternalServerError()

		fakeCreateUserService.execute.mockImplementationOnce(() => throwError(error))

		const res = await sut.handle(fakeRequest)

		expect(res).toEqual(serverError(error))
	})
})