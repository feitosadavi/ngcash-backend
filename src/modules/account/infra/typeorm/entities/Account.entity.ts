/* eslint-disable indent */
import { IAccountModel } from '@modules/account/domain/account.model'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('account')
class Account implements IAccountModel {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ default: 100 })
	balance!: number
}

export default Account