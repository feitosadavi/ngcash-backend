import express, { Express } from 'express'
import setupRoutes from './routes'
import setupMiddlewares from './middlewares'

export default (): Express => {
	const app = express()

	setupMiddlewares(app)
	setupRoutes(app)

	return app
}