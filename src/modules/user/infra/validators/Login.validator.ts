import Joi from 'joi'
import { IValidator } from '@shared/data/adapters'

export class LoginValidator implements IValidator {
	validate (input: any): IValidator.Output {
		const schema = Joi.object({
			username: Joi.string().required(),
			password: Joi
				.string()
				.required()
		})

		const { error } = schema.validate(input)
		if (error) return error.message
		return null
	}
}