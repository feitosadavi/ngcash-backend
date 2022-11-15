/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const config = require('./jest.config')
config.testMatch = ['**/*.test.ts']
module.exports = config