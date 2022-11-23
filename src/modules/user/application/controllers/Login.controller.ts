import { IValidator } from '@shared/data/adapters'
import { IController } from '../protocols'

export class LoginController implements IController {
	constructor(private readonly validator: IValidator) { }

	async handle (req: LoginController.Req): Promise<any> {
		this.validator.validate(req)
	}
}

export namespace LoginController {
	export type Req = {
		username: string
		password: string
	}
}