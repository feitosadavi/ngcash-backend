import { mock, MockProxy } from 'jest-mock-extended'
import { ICreateUserModel } from '@modules/user/domain/models'

import { IHasherAdapter } from '@shared/data/adapters/cryptography'
import { ICreateUserService } from '@modules/user/domain/contracts'
import { CreateUserController } from '@modules/user/application/controllers/CreateUser.controller'
import { AppError, USERNAME_ALREADY_EXISTS } from '@shared/errors'
import { throwError } from '@tests/helpers'
import { forbidden, serverError } from '@shared/errors/helpers'

const makeFakeCreateUserModel = (): ICreateUserModel => ({
	username: 'any_username',
	password: 'any_password'
})

// const makeFakeUserModel = (): IUserModel => ({
// 	username: 'any_username',
// 	password: 'any_password'
// })

const makeFakeRequest = (): CreateUserController.Req => ({
	body: makeFakeCreateUserModel()
})

describe('CreateUserController', () => {
	let sut: CreateUserController
	let fakeHasher: MockProxy<IHasherAdapter>
	let fakeCreateUserService: MockProxy<ICreateUserService>

	let fakeCreateUserModel: ICreateUserModel
	// let fakeUserModel: IUserModel
	let fakeRequest: CreateUserController.Req

	beforeAll(() => {
		fakeHasher = mock()
		fakeHasher.hash.mockResolvedValue('hashed_password')

		fakeCreateUserService = mock()
		fakeCreateUserService.execute.mockResolvedValue(true)

		fakeCreateUserModel = makeFakeCreateUserModel()
		// fakeUserModel = makeFakeUserModel()
		fakeRequest = makeFakeRequest()
	})

	beforeEach(() => {
		sut = new CreateUserController(fakeCreateUserService)
	})

	it('should call CreateUserService with correct input', async () => {
		await sut.handle(fakeRequest)

		expect(fakeCreateUserService.execute)
			.toHaveBeenCalledWith(fakeCreateUserModel)
	})

	it('should call return 403 if CreateUserService throws USERNAME_ALREADY_EXISTS error', async () => {
		fakeCreateUserService.execute
			.mockImplementationOnce(() => throwError(new AppError(USERNAME_ALREADY_EXISTS)))

		const res = await sut.handle(fakeRequest)

		expect(res)
			.toEqual(forbidden(new AppError(USERNAME_ALREADY_EXISTS)))
	})

	it('should call return 500 if CreateUserService throws other errors', async () => {
		fakeCreateUserService.execute
			.mockImplementationOnce(() => throwError())

		const res = await sut.handle(fakeRequest)

		expect(res)
			.toEqual(serverError())
	})
})