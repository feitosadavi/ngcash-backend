export const throwError = (error?: Error): never => {
	if (error) throw error
	throw new Error()
}