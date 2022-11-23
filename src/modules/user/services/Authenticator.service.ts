import { IHashComparerAdapter, ITokenGenerator } from '@shared/data/adapters/cryptography'
import { WrongPasswordError, WrongUsernameError } from '@shared/errors'
import { IAuthenticatorService } from '../domain/contracts'
import { ILoadOneUserByRepository, IUpdateUserRepository } from './repository.protocols'

export class AuthenticatorService implements IAuthenticatorService {
	constructor(
		private readonly loadOneUserBy: ILoadOneUserByRepository,
		private readonly hashComparer: IHashComparerAdapter,
		private readonly tokenGenerator: ITokenGenerator,
		private readonly updateUser: IUpdateUserRepository
	) { }

	async execute ({ username, password }: IAuthenticatorService.Input): Promise<IAuthenticatorService.Output> {
		const user = await this.loadOneUserBy.loadOneBy({ username })

		if (!user) throw new WrongUsernameError()

		const passwordMatches = await this.hashComparer.compare({ value: password, hash: user.password })

		if (!passwordMatches) throw new WrongPasswordError()

		const accessToken = await this.tokenGenerator.generate({ key: user.id })

		await this.updateUser.update({ id: user.id, data: { accessToken } })

		return { accessToken, id: user.id }
	}
}