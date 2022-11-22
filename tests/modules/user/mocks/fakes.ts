import { ICreateUserModel, IUserModel } from '@modules/user/domain/models'
import { makeFakeAccountModel } from '@tests/modules/account/mocks/fakes'

export const makeFakeUserModel = (): IUserModel => ({
	id: 'any_user_id',
	username: 'any_username',
	password: 'any_password',
	account: makeFakeAccountModel()
})

export const makeFakeCreateUserModel = (): ICreateUserModel => ({
	username: 'any_username',
	password: 'any_password'
})