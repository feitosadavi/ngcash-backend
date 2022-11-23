import { ICreateUserModel } from './models'

export interface ICreateUserService {
	execute (input: ICreateUserService.Input): Promise<ICreateUserService.Output>
}

export namespace ICreateUserService {
	export type Input = ICreateUserModel
	export type Output = boolean
}

export interface IAuthenticationService {
	execute (input: IAuthenticationService.Input): Promise<IAuthenticationService.Output>
}

export namespace IAuthenticationService {
	export type Input = {
		username: string
		password: string
	}
	export type Output = { accessToken: string, id: string } | null
} 