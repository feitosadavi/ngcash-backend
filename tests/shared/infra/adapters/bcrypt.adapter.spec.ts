/* eslint-disable @typescript-eslint/no-unused-vars */

import { IHashComparerAdapter } from '@shared/data/adapters'
import { BcryptAdapter } from '@shared/infra/adapters'
import bcrypt from 'bcrypt'

jest.mock('bcrypt')
describe('BcryptAdapter', () => {
	let sut: BcryptAdapter
	let fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

	let secret: string

	beforeAll(() => {
		secret = 'secret'
		fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
	})

	beforeEach(() => {
		sut = new BcryptAdapter(12)
	})

	describe('hash', () => {
		let salt: number
		let input: string

		beforeAll(() => {
			salt = 12
			input = 'any_input'

			fakeBcrypt.hash.mockImplementation(() => 'any_hash')
		})

		it('should call hash with correct params', async () => {
			await sut.hash(input)

			expect(fakeBcrypt.hash).toHaveBeenCalledWith(input, salt)
		})

		it('should return a hashedValue on success', async () => {
			const hashedInput = await sut.hash(input)

			expect(hashedInput).toBe('any_hash')
		})

		it('should rethrow if sign throws', async () => {
			fakeBcrypt.hash.mockImplementationOnce(() => { throw new Error('encryption_error') })

			const promise = sut.hash(input)

			await expect(promise).rejects.toThrow(new Error('encryption_error'))
		})
	})

	describe('compare', () => {
		let input: IHashComparerAdapter.Input

		beforeAll(() => {
			fakeBcrypt.compare.mockImplementation(() => true)
			input = {
				value: 'any_value',
				hash: 'any_hash'
			}
		})


		it('should call hash with correct params', async () => {
			await sut.compare(input)

			expect(fakeBcrypt.compare).toHaveBeenCalledWith(input.value, input.hash)
		})

		it('should return a false if input values didnt match', async () => {
			fakeBcrypt.compare.mockImplementationOnce(() => false)
			const hashedInput = await sut.compare(input)
			expect(hashedInput).toBe(false)
		})

		it('should return a true on success', async () => {
			const hashedInput = await sut.compare(input)

			expect(hashedInput).toBe(true)
		})

		it('should rethrow if sign throws', async () => {
			fakeBcrypt.compare.mockImplementationOnce(() => { throw new Error('encryption_error') })

			const promise = sut.compare(input)

			await expect(promise).rejects.toThrow(new Error('encryption_error'))
		})
	})
})