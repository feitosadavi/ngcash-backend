import { IHasherAdapter } from 'shared/data/adapters/cryptography'
import { ICreateUserService } from '../domain/contracts'
import { ICreateUserRepository } from './repository.protocols'

export class CreateUserService implements ICreateUserService {
	constructor(
		private readonly hasher: IHasherAdapter,
		private readonly createUserRepository: ICreateUserRepository
	) { }

	async execute (input: ICreateUserService.Input): Promise<ICreateUserService.Output> {
		const hashedPassword = await this.hasher.hash(input.password)
		const res = await this.createUserRepository.create({
			...input,
			password: hashedPassword
		})
		return res
	}
}