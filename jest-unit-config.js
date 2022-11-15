/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const config = require('./jest.config')
config.testMatch = ['**/*.spec.ts']
module.exports = config