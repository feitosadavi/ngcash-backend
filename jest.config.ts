export default {
	clearMocks: true,
	collectCoverage: false,
	coverageDirectory: 'coverage',
	roots: [
		'<rootDir>/src',
		'<rootDir>/tests'
	],
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!<rootDir>/src/**/*.protocols.ts',
	],
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest'
	},
	// moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
	// 	prefix: '<rootDir>/',
	// }),
	moduleNameMapper: {
		'@tests/(.*)': '<rootDir>/tests/$1',
		'@shared/(.*)': '<rootDir>/src/shared/$1', // captura tudo após @/; $1 é o resultado da captura da expressão regular
		'@modules/(.*)': '<rootDir>/src/modules/$1', // captura tudo após @/; $1 é o resultado da captura da expressão regular
		'@config/(.*)': '<rootDir>/src/config/$1' // captura tudo após @/; $1 é o resultado da captura da expressão regular
	}
}
