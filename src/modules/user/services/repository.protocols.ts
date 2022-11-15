import { ICreateUserModel, IUserModel } from 'modules/user/domain/models'

export interface ICreateUserRepository {
	create (input: ICreateUserRepository.Input): Promise<ICreateUserRepository.Output>
}

export namespace ICreateUserRepository {
	export type Input = ICreateUserModel
	export type Output = boolean
}

export interface ILoadOneUserByRepository {
	loadOneBy (input: ILoadOneUserByRepository.Input): Promise<ILoadOneUserByRepository.Output>
}

export namespace ILoadOneUserByRepository {
	export type Input = {
		[key: string]: string | number | boolean
	}
	export type Output = IUserModel | null
}