import { IController } from '@modules/user/application/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: IController) => {
	return async (req: Request, res: Response) => {
		const httpRequest = {
			...(req.body || {}),
			...(req.params || {}),
			...(req.query || {}),
		}

		if ((req as any).accountId) httpRequest.accountId = (req as any).accountId
		const httpResponse = await controller.handle(httpRequest)

		if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
			res.status(httpResponse.statusCode).json(httpResponse.body)
		} else {
			res.status(httpResponse.statusCode).json({
				error: httpResponse.body.error
			})
		}
	}
}
