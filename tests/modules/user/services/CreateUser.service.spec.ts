import { mock, MockProxy } from 'jest-mock-extended'
import { ICreateUserModel } from '../../../../src/modules/user/domain/models'
import { CreateUserService } from '../../../../src/modules/user/services'
// import { CreateUserService } from '@/'

import { IHasherAdapter } from 'shared/data/adapters/cryptography'

const makeFakeCreateUserModel = (): ICreateUserModel => ({
	username: 'any_username',
	password: 'any_password'
})

describe('CreateUserService', () => {
	let sut: CreateUserService
	let fakeHasher: MockProxy<IHasherAdapter>

	let fakeCreateUserModel: ICreateUserModel

	beforeAll(() => {
		fakeHasher = mock()
		fakeHasher.hash.mockResolvedValue('hashed_password')

		fakeCreateUserModel = makeFakeCreateUserModel()
	})

	beforeEach(() => {
		sut = new CreateUserService(fakeHasher)
	})

	it('should call hasher with correct input', async () => {
		await sut.execute(fakeCreateUserModel)
		expect(fakeHasher.hash).toHaveBeenCalledWith('any_password')
	})
})