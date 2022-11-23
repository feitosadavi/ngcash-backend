export interface IHashComparerAdapter {
	compare (input: IHashComparerAdapter.Input): Promise<IHashComparerAdapter.Output>
}

export namespace IHashComparerAdapter {
	export type Input = {
		value: string
		hash: string
	}
	export type Output = boolean
}