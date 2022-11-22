import dotenv from 'dotenv-safe'
import { dataSource } from '@shared/infra/typeorm'
import setupApp from './app'

dotenv.config({ example: './.env.example' })

const app = setupApp()

const PORT = process.env.PORT ?? 5050

dataSource.initialize().then(() => {
	app.listen(PORT, () => console.log(`Server running at 'http://localhost:${PORT}'`))
})