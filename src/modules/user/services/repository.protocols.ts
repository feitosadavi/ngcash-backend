import { ICreateUserModel } from 'modules/user/domain/models'

export interface ICreateUserRepository {
	create (input: ICreateUserRepository.Input): Promise<ICreateUserRepository.Output>
}

export namespace ICreateUserRepository {
	export type Input = ICreateUserModel
	export type Output = boolean
}