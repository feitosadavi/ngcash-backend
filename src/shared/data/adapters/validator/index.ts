export interface IValidator {
	validate (input: IValidator.Input): Promise<IValidator.Output>
}

export namespace IValidator {
	export type Input = any
	export type Output = Error | null
}