export interface IHasherAdapter {
	hash (input: IHasherAdapter.Input): Promise<IHasherAdapter.Output>
}

export namespace IHasherAdapter {
	export type Input = string
	export type Output = string
}