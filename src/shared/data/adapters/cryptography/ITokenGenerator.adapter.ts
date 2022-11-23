export interface ITokenGenerator {
	generate (input: ITokenGenerator.Input): Promise<ITokenGenerator.Output>
}

export namespace ITokenGenerator {
	export type Input = {
		key: string
	}
	export type Output = string
}
