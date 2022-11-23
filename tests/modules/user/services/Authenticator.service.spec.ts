import { mock, MockProxy } from 'jest-mock-extended'
import { IUserModel } from '@modules/user/domain/models'
import { AuthenticatorService } from '@modules/user/services'

import { IHasherAdapter } from '@shared/data/adapters/cryptography'
import { ILoadOneUserByRepository, IUpdateUserRepository } from '@modules/user/services/repository.protocols'
import { WrongPasswordError, WrongUsernameError } from '@shared/errors'
import { makeFakeUserModel } from '../mocks/fakes'
import { IAuthenticatorService } from '@modules/user/domain/contracts'
import { IHashComparerAdapter, ITokenGenerator } from '@shared/data/adapters/cryptography'

const makeFakeInput = (): IAuthenticatorService.Input => ({
	username: 'any_username',
	password: 'any_password'
})

describe('AuthenticatorService', () => {
	let sut: AuthenticatorService
	let fakeHasher: MockProxy<IHasherAdapter>
	let fakeLoadOneUserRepository: MockProxy<ILoadOneUserByRepository>
	let fakeHashComparerAdapter: MockProxy<IHashComparerAdapter>
	let fakeTokenGenerator: MockProxy<ITokenGenerator>
	let fakeUpdateUserRepository: MockProxy<IUpdateUserRepository>

	let fakeUserModel: IUserModel
	let fakeInput: IAuthenticatorService.Input
	const fakeToken = 'any_token'

	beforeAll(() => {
		fakeHasher = mock()
		fakeHasher.hash.mockResolvedValue('hashed_password')

		fakeLoadOneUserRepository = mock()
		fakeLoadOneUserRepository.loadOneBy.mockResolvedValue(makeFakeUserModel())

		fakeHashComparerAdapter = mock()
		fakeHashComparerAdapter.compare.mockResolvedValue(true)

		fakeUpdateUserRepository = mock()
		fakeUpdateUserRepository.update.mockResolvedValue()

		fakeTokenGenerator = mock()
		fakeTokenGenerator.generate.mockResolvedValue(fakeToken)

		fakeUserModel = makeFakeUserModel()
		fakeInput = makeFakeInput()
	})

	beforeEach(() => {
		sut = new AuthenticatorService(
			fakeLoadOneUserRepository,
			fakeHashComparerAdapter,
			fakeTokenGenerator,
			fakeUpdateUserRepository
		)
	})

	it('should call loadOneUserBy with correct input', async () => {
		await sut.execute(fakeInput)

		const { username } = fakeInput

		expect(fakeLoadOneUserRepository.loadOneBy).toHaveBeenCalledWith({ username })
	})

	it('should thorw if loadOneUserBy do not returns a user', async () => {
		fakeLoadOneUserRepository.loadOneBy.mockResolvedValueOnce(null)

		const promise = sut.execute(fakeInput)

		await expect(promise).rejects.toThrowError(new WrongUsernameError())
	})


	it('should call hashComparer with correct input', async () => {
		await sut.execute(fakeInput)

		const { password } = fakeInput

		const fakeHashComparerInput: IHashComparerAdapter.Input = {
			value: password,
			hash: fakeUserModel.password
		}

		expect(fakeHashComparerAdapter.compare).toHaveBeenCalledWith(fakeHashComparerInput)
	})

	it('should thorw if hashComparer do not returns a user', async () => {
		fakeHashComparerAdapter.compare.mockReturnValueOnce(Promise.resolve(false))

		const promise = sut.execute(fakeInput)
		await expect(promise).rejects.toThrowError(new WrongPasswordError())
	})

	it('should call tokenGenerator with correct input', async () => {
		await sut.execute(fakeInput)

		expect(fakeTokenGenerator.generate).toHaveBeenCalledWith({ key: fakeUserModel.id })
	})

	it('should call updateUserRepository with correct input', async () => {
		await sut.execute(fakeInput)

		expect(fakeUpdateUserRepository.update)
			.toHaveBeenCalledWith({ id: fakeUserModel.id, data: { accessToken: fakeToken } })
	})

	it('should return credentials on success', async () => {
		const credentials = await sut.execute(fakeInput)

		expect(credentials).toEqual({ accessToken: fakeToken, id: fakeUserModel.id })
	})

	// it('should call hasher with correct input', async () => {
	// 	await sut.execute(fakeCreateUserModel)
	// 	expect(fakeHasher.hash).toHaveBeenCalledWith(fakeCreateUserModel.password)
	// })

	// it('should call createUserRepository with correct input', async () => {
	// 	await sut.execute(fakeCreateUserModel)
	// 	expect(fakeCreateUserRepository.create)
	// 		.toHaveBeenCalledWith({ ...fakeCreateUserModel, password: 'hashed_password' })
	// })

	// it('should return true on success', async () => {
	// 	const result = await sut.execute(fakeCreateUserModel)
	// 	expect(result).toBe(true)
	// })
})