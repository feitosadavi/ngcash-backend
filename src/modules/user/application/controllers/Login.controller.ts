import { IAuthenticatorService } from '@modules/user/domain/contracts'
import { IValidator } from '@shared/data/adapters'
import { ValidationError, WrongPasswordError, WrongUsernameError } from '@shared/errors'
import { badRequest, processErrors, success } from '@shared/errors/helpers'
import { IController } from '../protocols'

export class LoginController implements IController {
	constructor(
		private readonly validator: IValidator,
		private readonly authenticator: IAuthenticatorService
	) { }

	async handle (req: LoginController.Req): Promise<any> {
		try {
			const errorMsg = this.validator.validate(req)
			if (errorMsg) throw new ValidationError(errorMsg)

			const credentials = await this.authenticator.execute(req)

			return success(credentials)

		} catch (error: any) {
			return processErrors(error, [{
				possibleErrorName: ValidationError.name,
				return: badRequest(error)
			}, {
				possibleErrorName: WrongUsernameError.name,
				return: badRequest(error)
			}, {
				possibleErrorName: WrongPasswordError.name,
				return: badRequest(error)
			}])
		}
	}
}

export namespace LoginController {
	export type Req = {
		username: string
		password: string
	}
}