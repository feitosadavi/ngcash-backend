
import { ICreateUserRepository, ILoadOneUserByRepository } from '@modules/user/services/repository.protocols'
import { Repository } from 'typeorm'
import User from '../entities/User.entity'

export class UserRepository implements ICreateUserRepository, ILoadOneUserByRepository {

	constructor(private readonly ormRepository: Repository<User>) { }

	async create (input: ICreateUserRepository.Input): Promise<ICreateUserRepository.Output> {

		const res = await this.ormRepository.save(input)

		return !!res.id
	}

	async loadOneBy (input: ILoadOneUserByRepository.Input): Promise<ILoadOneUserByRepository.Output> {
		const user = this.ormRepository.findOneBy(input)
		return user
	}
}