export interface IValidator {
	validate (input: IValidator.Input): IValidator.Output
}

export namespace IValidator {
	export type Input = any
	export type Output = string | null
}