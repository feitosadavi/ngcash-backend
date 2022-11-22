import Joi from 'joi'
import { IValidator } from '@shared/data/adapters'
import { passwordRule } from './user-validator.rules'

export class CreateUserValidator implements IValidator {
	validate (input: any): IValidator.Output {
		const schema = Joi.object({
			username: Joi.string().required().min(3),
			password: Joi
				.string()
				.required()
				.min(8)
				.regex(new RegExp(passwordRule.pattern))
				.messages({ 'string.pattern.base': passwordRule.message })
		})

		const { error } = schema.validate(input)
		if (error) return error.message
		return null
	}
}