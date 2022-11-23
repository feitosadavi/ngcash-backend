import { IAccountModel } from '@modules/account/domain/account.model'

export interface ICreateUserModel {
	username: string
	password: string
}

export interface IUserModel {
	id: string
	username: string
	password: string
	account: IAccountModel
	accessToken?: string
}
