export default {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	roots: [
		'<rootDir>/src',
		'<rootDir>/tests'
	],
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
	],
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest'
	},
	moduleNameMapper: {
		'@/(.*)': '<rootDir>/src/$1', // captura tudo após @/; $1 é o resultado da captura da expressão regular
		'@tests(.*)': '<rootDir>/tests/$1', // captura tudo após @/; $1 é o resultado da captura da expressão regular
	},
}
