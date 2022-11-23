import bcrypt from 'bcrypt'
import { IHashComparerAdapter, IHasherAdapter } from '@shared/data/adapters'

export class BcryptAdapter implements IHasherAdapter, IHashComparerAdapter {
	constructor(private readonly salt: number) { }

	async hash (input: string): Promise<string> {
		return bcrypt.hash(input, this.salt)
	}

	async compare ({ value, hash }: IHashComparerAdapter.Input): Promise<boolean> {
		return await bcrypt.compare(value, hash)
	}
}