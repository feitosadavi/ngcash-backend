import { ICreateUserModel } from './models'

export interface ICreateUserService {
	execute (input: ICreateUserService.Input): Promise<ICreateUserService.Output>
}

export namespace ICreateUserService {
	export type Input = ICreateUserModel
	export type Output = boolean
}

export interface IAuthenticatorService {
	execute (input: IAuthenticatorService.Input): Promise<IAuthenticatorService.Output>
}

export namespace IAuthenticatorService {
	export type Input = {
		username: string
		password: string
	}
	export type Output = { accessToken: string, id: string } | null
} 