/* eslint-disable indent */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { IUserModel } from '@modules/user/domain/models'
import Account from '@modules/account/infra/typeorm/entities/Account.entity'

@Entity('user')
class User implements IUserModel {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ unique: true })
	username!: string

	@Column()
	password!: string

	@OneToOne(() => Account, { cascade: true })
	@JoinColumn()
	account!: Account
}

export default User