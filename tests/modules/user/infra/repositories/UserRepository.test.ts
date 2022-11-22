import { ICreateUserModel } from '@modules/user/domain/models'
import User from '@modules/user/infra/typeorm/entities/User.entity'
import { UserRepository } from '@modules/user/infra/typeorm/repositories/UserRepository'
import { dataSource } from '@shared/infra/typeorm'
import { Repository } from 'typeorm'
import { makeFakeCreateUserModel } from '../../mocks/fakes'

describe('UserRepository', () => {
	let sut: UserRepository
	let ormRepository: Repository<User>

	let fakeCreateUserModel: ICreateUserModel

	beforeAll(async () => {
		ormRepository = (await dataSource.initialize()).manager.getRepository(User)
		sut = new UserRepository(ormRepository)

		fakeCreateUserModel = makeFakeCreateUserModel()
	})

	afterEach(async () => {
		ormRepository.clear()
	})

	describe('create', () => {
		it('should not create a new user if username already exists', async () => {
			await ormRepository.save(fakeCreateUserModel)

			const res = await sut.create(fakeCreateUserModel)

			expect(res).toBe(false)
		})
		it('should throw if orm throws a comum error', async () => {
			await ormRepository.save(fakeCreateUserModel)
			jest.spyOn(ormRepository, 'insert').mockImplementationOnce(() => { throw new Error() })
			const promise = sut.create(fakeCreateUserModel)

			await expect(promise).rejects.toThrow()
		})
		it('should create a new user on success', async () => {
			const res = await sut.create(fakeCreateUserModel)
			expect(res).toBe(true)
		})
	})

	describe('loadOneBy', () => {
		it('should search for one user given the input', async () => {
			const { username, password } = fakeCreateUserModel

			await ormRepository.save(fakeCreateUserModel)

			const user = await sut.loadOneBy({ username })

			expect(user?.id).toBeTruthy()
			expect(user?.username).toBe(username)
			expect(user?.password).toBe(password)
		})
	})

})