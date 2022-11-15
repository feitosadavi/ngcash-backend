export interface IController {
	handle (req: any): Promise<any>
}

export interface IRequest<B = any> {
	body?: B
}

export interface IResponse<B = any> {
	statusCode: number
	body?: B
}