/* eslint-disable indent */
import { IResponse } from '@modules/user/application/protocols'

export const success = (data: any): IResponse => ({
	statusCode: 200,
	body: data
})

export const forbidden = ({ name, message }: Error): IResponse => ({
	statusCode: 403,
	body: {
		error: {
			type: name,
			message: message
		}
	}
})

export const badRequest = ({ name, message }: Error): IResponse => ({
	statusCode: 400,
	body: {
		error: {
			type: name,
			message: message
		}
	}
})

export const serverError = (error?: Error): IResponse => ({
	statusCode: 500,
	body: {
		error: {
			type: error?.name,
			message: error?.message
		}
	}
})

type Foo = {
	possibleErrorName: string
	return: any
}

export const processErrors = (error: Error, errorPossibilities: Foo[]): IResponse => {
		const errorMatch = errorPossibilities.filter(errorPossibilitie => errorPossibilitie.possibleErrorName === error.name)[0]
	console.log({ errorMatch })

		if (errorMatch) return errorMatch.return
		else return serverError(error)
}