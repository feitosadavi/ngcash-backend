import Account from '@modules/account/infra/typeorm/entities/Account.entity'
import { ICreateUserModel } from '@modules/user/domain/models'
import User from '@modules/user/infra/typeorm/entities/User.entity'
import { UserRepository } from '@modules/user/infra/typeorm/repositories/UserRepository'
import { dataSource } from '@shared/infra/typeorm'
import { Repository } from 'typeorm'
import { makeFakeCreateUserModel } from '../../mocks/fakes'

describe('UserRepository', () => {
	let sut: UserRepository

	let userOrmRepository: Repository<User>
	let accountOrmRepository: Repository<Account>

	let fakeCreateUserModel: ICreateUserModel

	beforeAll(async () => {
		const ds = await dataSource.initialize()
		userOrmRepository = ds.manager.getRepository(User)
		accountOrmRepository = ds.manager.getRepository(Account)

		sut = new UserRepository(ds)

		fakeCreateUserModel = makeFakeCreateUserModel()
	})


	afterEach(async () => {
		const user = (await userOrmRepository.find())[0]
		if (user) await userOrmRepository.delete({ id: user.id })

		const account = (await accountOrmRepository.find())[0]
		if (account) await accountOrmRepository.delete({ id: account.id })

	})

	describe('create', () => {
		it('should not create a new user if username already exists', async () => {
			await userOrmRepository.save(fakeCreateUserModel)

			const promise = sut.create(fakeCreateUserModel)

			await expect(promise).rejects.toThrow()
		})

		it('should create a new user and account on success', async () => {
			const res = await sut.create(fakeCreateUserModel)
			const account = (await accountOrmRepository.find())[0]

			expect(account.balance).toBe(100)
			expect(res).toBe(true)
		})
	})

	describe('loadOneBy', () => {
		it('should search for one user given the input', async () => {
			const account = new Account()
			await accountOrmRepository.insert(account)

			const { username, password } = fakeCreateUserModel
			await userOrmRepository.insert({ username, password, account })

			const user = await sut.loadOneBy({ username })

			expect(user?.id).toBeTruthy()
			expect(user?.username).toBe(username)
			expect(user?.password).toBe(password)
			expect(user?.account?.id).toBeTruthy()
			expect(user?.account?.balance).toBe(100)
		})
	})

})