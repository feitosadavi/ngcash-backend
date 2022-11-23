import request from 'supertest'
import { Express } from 'express'

import setupApp from '@config/app'
import { CreateUserController } from '@modules/user/application/controllers/CreateUser.controller'
import { dataSource } from '@shared/infra/typeorm'
import { Repository } from 'typeorm'
import User from '@modules/user/infra/typeorm/entities/User.entity'
import Account from '@modules/account/infra/typeorm/entities/Account.entity'
import { makeFakeCreateUserModel } from '@tests/modules/user/mocks/fakes'
import { ICreateUserModel } from '@modules/user/domain/models'
import { BcryptAdapter } from '@shared/infra/adapters'


describe('User Routes', () => {
	let app: Express
	let userOrmRepository: Repository<User>
	let accountOrmRepository: Repository<Account>

	let fakeCreateUserModel: ICreateUserModel

	beforeAll(async () => {
		const ds = await dataSource.initialize()
		userOrmRepository = ds.manager.getRepository(User)
		accountOrmRepository = ds.manager.getRepository(Account)

		fakeCreateUserModel = makeFakeCreateUserModel()

		app = setupApp()
	})

	afterEach(async () => {
		const user = (await userOrmRepository.find())[0]
		if (user) await userOrmRepository.delete({ id: user.id })

		const account = (await accountOrmRepository.find())[0]
		if (account) await accountOrmRepository.delete({ id: account.id })

	})

	describe('POST /users', () => {
		it('should return 200 on success', async () => {
			const params: CreateUserController.Req = {
				username: 'davi123',
				password: '12345678D'
			}
			const { status, body } = await request(app).post('/api/users').send(params)
			expect(status).toBe(200)
			expect(body).toBe(true)
		})
		it('should return 400 if request params dont pass by validator', async () => {
			const params: CreateUserController.Req = {
				username: 'davi123',
				password: '1'
			}
			const { status, body } = await request(app).post('/api/users').send(params)
			expect(status).toBe(400)
			expect(body.error.type).toBe('ValidationError')
		})
	})

	describe('POST /login', () => {
		it('should return 200 on success', async () => {
			const { username, password } = fakeCreateUserModel

			const bcryptAdapter = new BcryptAdapter(12)

			const hashedPassword = await bcryptAdapter.hash(password)

			await userOrmRepository.insert({ username, password: hashedPassword })

			const { status, body: { accessToken, id } } = await request(app).post('/api/login').send({ username, password })

			expect(status).toBe(200)
			expect(accessToken).toBeTruthy()
			expect(id).toBeTruthy()
		})

		it('should return 400 if username is wrong', async () => {
			const { password } = fakeCreateUserModel

			const { status, body } = await request(app).post('/api/login').send({ username: 'wronguser', password })

			expect(status).toBe(400)
			expect(body.error.type).toBe('WrongUsernameError')
		})

		it('should return 400 if password is wrong', async () => {
			const { username, password } = fakeCreateUserModel

			const bcryptAdapter = new BcryptAdapter(12)

			const hashedPassword = await bcryptAdapter.hash(password)

			await userOrmRepository.insert({ username, password: hashedPassword })

			const { status, body } = await request(app).post('/api/login').send({ username, password: 'wrongpassword' })

			expect(status).toBe(400)
			expect(body.error.type).toBe('WrongPasswordError')
		})

		it('should return 400 if request params dont pass by validator', async () => {
			const { password } = fakeCreateUserModel

			const { status, body } = await request(app).post('/api/login').send({ password })
			expect(status).toBe(400)
			expect(body.error.type).toBe('ValidationError')
		})
	})
})