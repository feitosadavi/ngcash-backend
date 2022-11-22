import bcrypt from 'bcrypt'
import { IHasherAdapter } from '@shared/data/adapters'

export class BcryptAdapter implements IHasherAdapter {
	constructor(private readonly salt: number) { }

	async hash (input: string): Promise<string> {
		return bcrypt.hash(input, this.salt)
	}
}