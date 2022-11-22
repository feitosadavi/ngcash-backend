import { CreateUserController } from '@modules/user/application/controllers/CreateUser.controller'
import { CreateUserService } from '@modules/user/services'
import { BcryptAdapter } from '@shared/infra/adapters'
import { adaptRoute } from '@shared/infra/adapters/express-route.adapter'
import { dataSource } from '@shared/infra/typeorm'
import { Router } from 'express'
import { UserRepository } from '../typeorm/repositories/UserRepository'
import { CreateUserValidator } from '../validators'

const SALT = 12
const bcryptAdapter = new BcryptAdapter(SALT)

const userRepository = new UserRepository(dataSource)
const createUserService = new CreateUserService(bcryptAdapter, userRepository, userRepository)
const createUserValidator = new CreateUserValidator()
const createUserController = new CreateUserController(createUserValidator, createUserService)

export default (router: Router): void => {
	router.post('/users', adaptRoute(createUserController))
}