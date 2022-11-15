/* eslint-disable indent */
import { ICreateUserService } from '@modules/user/domain/contracts'
import { ICreateUserModel, IUserModel } from '@modules/user/domain/models'
import { AppError, USERNAME_ALREADY_EXISTS } from '@shared/errors'
import { forbidden, serverError, success } from '@shared/errors/helpers'
import { IController, IRequest, IResponse } from '../protocols'

export class CreateUserController implements IController {
	constructor(private readonly createUserService: ICreateUserService) { }

	async handle (req: CreateUserController.Req): Promise<CreateUserController.Res> {
		try {
			if (req.body) {
				const user = await this.createUserService.execute(req?.body)
			}
			return success(true)

		} catch (error: any) {
			if (error instanceof AppError) {
				switch (error.name) {
					case USERNAME_ALREADY_EXISTS.name:
						return forbidden(error)
						break

					default:
						serverError({ stack: error.stack })
						break
				}
			}

			return serverError({ stack: error.stack })
		}
	}
}

export namespace CreateUserController {
	export type Req = IRequest<ICreateUserModel>
	export type Res = IResponse
}