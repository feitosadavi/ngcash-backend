import { IHasherAdapter } from 'shared/data/adapters/cryptography'
import { ICreateUserService } from '../domain/contracts'

export class CreateUserService implements ICreateUserService {
	constructor(private readonly hasher: IHasherAdapter) { }

	async execute (input: ICreateUserService.Input): Promise<ICreateUserService.Output> {
		await this.hasher.hash(input.password)
		return false
	}
}