import request from 'supertest'
import { Express } from 'express'

import setupApp from '@config/app'
import { CreateUserController } from '@modules/user/application/controllers/CreateUser.controller'
import { dataSource } from '@shared/infra/typeorm'
import { Repository } from 'typeorm'
import User from '@modules/user/infra/typeorm/entities/User.entity'
import Account from '@modules/account/infra/typeorm/entities/Account.entity'


describe('User Routes', () => {
	let app: Express
	let userOrmRepository: Repository<User>
	let accountOrmRepository: Repository<Account>

	beforeAll(async () => {
		const ds = await dataSource.initialize()
		userOrmRepository = ds.manager.getRepository(User)
		accountOrmRepository = ds.manager.getRepository(Account)

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
})