import { mock, MockProxy } from 'jest-mock-extended'
import { ICreateUserModel, IUserModel } from '@modules/user/domain/models'
import { CreateUserService } from '@modules/user/services'

import { IHasherAdapter } from '@shared/data/adapters/cryptography'
import { ICreateUserRepository, ILoadOneUserByRepository } from '@modules/user/services/repository.protocols'
import { UsernameAlreadyExistsError } from '@shared/errors'

const makeFakeCreateUserModel = (): ICreateUserModel => ({
	username: 'any_username',
	password: 'any_password'
})

const makeFakeUserModel = (): IUserModel => ({
	id: 'any_id',
	username: 'any_username',
	password: 'any_password'
})

describe('CreateUserService', () => {
	let sut: CreateUserService
	let fakeHasher: MockProxy<IHasherAdapter>
	let fakeCreateUserRepository: MockProxy<ICreateUserRepository>
	let fakeLoadOneUserRepository: MockProxy<ILoadOneUserByRepository>

	let fakeCreateUserModel: ICreateUserModel
	let fakeUserModel: IUserModel

	beforeAll(() => {
		fakeHasher = mock()
		fakeHasher.hash.mockResolvedValue('hashed_password')

		fakeCreateUserRepository = mock()
		fakeCreateUserRepository.create.mockResolvedValue(true)

		fakeLoadOneUserRepository = mock()
		fakeLoadOneUserRepository.loadOneBy.mockResolvedValue(null)

		fakeCreateUserModel = makeFakeCreateUserModel()
		fakeUserModel = makeFakeUserModel()
	})

	beforeEach(() => {
		sut = new CreateUserService(
			fakeHasher,
			fakeLoadOneUserRepository,
			fakeCreateUserRepository)
	})

	it('should call fakeLoadOneUserRepository with correct input', async () => {
		await sut.execute(fakeCreateUserModel)

		const { username } = fakeCreateUserModel

		expect(fakeLoadOneUserRepository.loadOneBy)
			.toHaveBeenCalledWith({ username })
	})

	it('should thorw if fakeLoadOneUserRepository returns a user', async () => {
		fakeLoadOneUserRepository.loadOneBy.mockReturnValueOnce(Promise.resolve(fakeUserModel))

		const promise = sut.execute(fakeCreateUserModel)

		await expect(promise)
			.rejects.toThrowError(new UsernameAlreadyExistsError())
	})

	it('should call hasher with correct input', async () => {
		await sut.execute(fakeCreateUserModel)
		expect(fakeHasher.hash).toHaveBeenCalledWith(fakeCreateUserModel.password)
	})

	it('should call createUserRepository with correct input', async () => {
		await sut.execute(fakeCreateUserModel)
		expect(fakeCreateUserRepository.create)
			.toHaveBeenCalledWith({ ...fakeCreateUserModel, password: 'hashed_password' })
	})

	it('should return true on success', async () => {
		const result = await sut.execute(fakeCreateUserModel)
		expect(result).toBe(true)
	})
})