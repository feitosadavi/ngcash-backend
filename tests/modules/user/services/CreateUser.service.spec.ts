import { mock, MockProxy } from 'jest-mock-extended'
import { ICreateUserModel } from '../../../../src/modules/user/domain/models'
import { CreateUserService } from '../../../../src/modules/user/services'
// import { CreateUserService } from '@/'

import { IHasherAdapter } from 'shared/data/adapters/cryptography'
import { ICreateUserRepository } from 'modules/user/services/repository.protocols'

const makeFakeCreateUserModel = (): ICreateUserModel => ({
	username: 'any_username',
	password: 'any_password'
})

describe('CreateUserService', () => {
	let sut: CreateUserService
	let fakeHasher: MockProxy<IHasherAdapter>
	let fakeCreateUserRepository: MockProxy<ICreateUserRepository>

	let fakeCreateUserModel: ICreateUserModel

	beforeAll(() => {
		fakeHasher = mock()
		fakeHasher.hash.mockResolvedValue('hashed_password')

		fakeCreateUserRepository = mock()
		fakeCreateUserRepository.create.mockResolvedValue(true)

		fakeCreateUserModel = makeFakeCreateUserModel()
	})

	beforeEach(() => {
		sut = new CreateUserService(fakeHasher, fakeCreateUserRepository)
	})

	it('should call hasher with correct input', async () => {
		await sut.execute(fakeCreateUserModel)
		expect(fakeHasher.hash).toHaveBeenCalledWith('any_password')
	})

	it('should call createUserRepository with correct input', async () => {
		await sut.execute(fakeCreateUserModel)
		expect(fakeCreateUserRepository.create)
			.toHaveBeenCalledWith({ ...fakeCreateUserModel, password: 'hashed_password' })
	})
})