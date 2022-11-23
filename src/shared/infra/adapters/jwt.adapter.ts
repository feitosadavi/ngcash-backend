import { ITokenGenerator } from '@shared/data/adapters'
import { sign } from 'jsonwebtoken'

export class JWTAdapter implements ITokenGenerator {
	constructor(private readonly secret: string) { }

	async generate (input: ITokenGenerator.Input): Promise<ITokenGenerator.Output> {
		const token = sign(input, this.secret)
		return token
	}

}