import { IHasherAdapter } from 'shared/data/adapters/cryptography'
import { ICreateUserService } from '../domain/contracts'
import { ICreateUserRepository, ILoadOneUserByRepository } from './repository.protocols'

export class CreateUserService implements ICreateUserService {
	constructor(
		private readonly hasher: IHasherAdapter,
		private readonly loadOneUserBy: ILoadOneUserByRepository,
		private readonly createUserRepository: ICreateUserRepository,

	) { }

	async execute (input: ICreateUserService.Input): Promise<ICreateUserService.Output> {
		const { username, password } = input

		await this.loadOneUserBy.loadOneBy({ username })

		const hashedPassword = await this.hasher.hash(password)

		const res = await this.createUserRepository.create({
			username,
			password: hashedPassword
		})

		return res
	}
}