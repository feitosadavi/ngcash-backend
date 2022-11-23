import { CreateUserController } from '@modules/user/application/controllers/CreateUser.controller'
import { LoginController } from '@modules/user/application/controllers/Login.controller'
import { AuthenticatorService, CreateUserService } from '@modules/user/services'
import { BcryptAdapter } from '@shared/infra/adapters'
import { adaptRoute } from '@shared/infra/adapters/express-route.adapter'
import { JWTAdapter } from '@shared/infra/adapters/jwt.adapter'
import { dataSource } from '@shared/infra/typeorm'
import { Router } from 'express'
import { UserRepository } from '../typeorm/repositories/UserRepository'
import { CreateUserValidator, LoginValidator } from '../validators'


const SALT = 12
const bcryptAdapter = new BcryptAdapter(SALT)
const jwtAdapter = new JWTAdapter(process.env.SECRET ?? 'biscoito')

const userRepository = new UserRepository(dataSource)
const createUserService = new CreateUserService(bcryptAdapter, userRepository, userRepository)
const createUserValidator = new CreateUserValidator()
const createUserController = new CreateUserController(createUserValidator, createUserService)


const authenticatorService = new AuthenticatorService(userRepository, bcryptAdapter, jwtAdapter, userRepository)
const loginValidator = new LoginValidator()
const loginController = new LoginController(loginValidator, authenticatorService)

export default (router: Router): void => {
	router.post('/users', adaptRoute(createUserController))

	router.post('/login', adaptRoute(loginController))
}