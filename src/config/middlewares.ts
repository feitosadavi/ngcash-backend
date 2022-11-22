import { Express, json } from 'express'
import cors from 'cors'
import { contentType } from '@shared/infra/http/middlewares'

export default (app: Express): void => {
	app.use(json())
	app.use(cors())
	app.use(contentType)
}
