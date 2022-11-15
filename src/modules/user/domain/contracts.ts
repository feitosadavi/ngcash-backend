import { ICreateUserModel } from './models'

export interface ICreateUserService {
	execute (input: ICreateUserService.Input): Promise<ICreateUserService.Output>
}

export namespace ICreateUserService {
	export type Input = ICreateUserModel
	export type Output = boolean
}