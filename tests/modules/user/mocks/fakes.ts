import { ICreateUserModel, IUserModel } from '@modules/user/domain/models'

export const makeFakeUserModel = (): IUserModel => ({
	id: 'any_id',
	username: 'any_username',
	password: 'any_password'
})

export const makeFakeCreateUserModel = (): ICreateUserModel => ({
	username: 'any_username',
	password: 'any_password'
})