import { IResponse } from '@modules/user/application/protocols'
import { AppError, ErrorInfo, INTERNAL_SERVER_ERROR } from '.'

export const success = (data: any): IResponse => ({
	statusCode: 200,
	body: data
})

export const forbidden = (error: ErrorInfo): IResponse => ({
	statusCode: 300,
	body: new AppError(error)
})

export const serverError = (error?: Partial<ErrorInfo>): IResponse => ({
	statusCode: 500,
	body: new AppError({ ...INTERNAL_SERVER_ERROR, stack: error?.stack },)
})