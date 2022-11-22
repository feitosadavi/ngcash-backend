/* eslint-disable indent */
import { ICreateUserService } from '@modules/user/domain/contracts'
import { ICreateUserModel } from '@modules/user/domain/models'
import { IValidator } from '@shared/data/adapters'
import { UsernameAlreadyExistsError, ValidationError } from '@shared/errors'
import { badRequest, forbidden, processErrors, success } from '@shared/errors/helpers'
import { IController, IResponse } from '../protocols'

export class CreateUserController implements IController {
	constructor(private readonly validator: IValidator, private readonly createUserService: ICreateUserService) { }

	async handle (req: CreateUserController.Req): Promise<CreateUserController.Res> {
		try {
			const errorMsg = this.validator.validate(req)

			if (errorMsg) throw new ValidationError(errorMsg)

			const res = await this.createUserService.execute(req)

			return success(res)

		} catch (error: any) {
			return processErrors(error, [{
				possibleErrorName: UsernameAlreadyExistsError.name,
				return: forbidden(error)
			}, {
					possibleErrorName: ValidationError.name,
					return: badRequest(error)
			}])
		}
	}
}

export namespace CreateUserController {
	export type Req = ICreateUserModel
	export type Res = IResponse
}