
import Account from '@modules/account/infra/typeorm/entities/Account.entity'
import { ICreateUserRepository, ILoadOneUserByRepository, IUpdateUserRepository } from '@modules/user/services/repository.protocols'
import { dataSource } from '@shared/infra/typeorm'
import { DataSource } from 'typeorm'
import User from '../entities/User.entity'

export class UserRepository implements ICreateUserRepository, ILoadOneUserByRepository, IUpdateUserRepository {

	constructor(private readonly orm: DataSource) { }

	async create ({ username, password }: ICreateUserRepository.Input): Promise<ICreateUserRepository.Output> {
		const queryRunner = dataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()

		try {
			const account = new Account()
			await queryRunner.manager.insert(Account, account)

			await queryRunner.manager.insert(User, { username, password, account })

			await queryRunner.commitTransaction()

			return true

		} catch (error) {
			console.log(error)

			await queryRunner.rollbackTransaction()
			throw error

		} finally {
			await queryRunner.release()
		}
	}

	async update ({ id, data }: IUpdateUserRepository.Input): Promise<void> {
		const userRepository = this.orm.getRepository<User>(User)
		await userRepository.update({ id }, data)
	}

	async loadOneBy (input: ILoadOneUserByRepository.Input): Promise<ILoadOneUserByRepository.Output> {
		try {
			const user = await this.orm.getRepository<User>('user').findOne({ where: { ...input }, relations: { account: true } })
			return user
		} catch (error) {
			console.log(error)
			return null

		}
	}
}