import { DataSource } from 'typeorm'
import User from '@modules/user/infra/typeorm/entities/User.entity'


export const dataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'postgres',
	database: 'postgres',
	entities: [User],
	synchronize: true,
})