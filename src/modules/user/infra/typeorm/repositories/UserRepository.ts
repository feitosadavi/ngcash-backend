
import { ICreateUserRepository, ILoadOneUserByRepository } from '@modules/user/services/repository.protocols'
import { QueryFailedError, Repository } from 'typeorm'
import User from '../entities/User.entity'

export class UserRepository implements ICreateUserRepository, ILoadOneUserByRepository {

	constructor(private readonly ormRepository: Repository<User>) { }

	async create (input: ICreateUserRepository.Input): Promise<ICreateUserRepository.Output> {
		try {
			const res = await this.ormRepository.insert(input)

			return !!res.identifiers[0].id
		} catch (error) {
			if (error instanceof QueryFailedError) return false
			else throw error
		}
	}

	async loadOneBy (input: ILoadOneUserByRepository.Input): Promise<ILoadOneUserByRepository.Output> {
		const user = this.ormRepository.findOneBy(input)
		return user
	}
}