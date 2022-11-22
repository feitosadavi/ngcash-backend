import { Express, Router } from 'express'
import userRoutes from '@modules/user/infra/http/user.routes'

export default (app: Express): void => {
	const router = Router()
	app.use('/api', router)
	userRoutes(router)
}