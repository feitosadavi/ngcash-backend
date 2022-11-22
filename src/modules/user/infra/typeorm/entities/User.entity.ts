/* eslint-disable indent */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { IUserModel } from '@modules/user/domain/models'

@Entity('user')
class User implements IUserModel {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ unique: true })
	username!: string

	@Column()
	password!: string
}

export default User