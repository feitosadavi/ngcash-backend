import { IAccountModel } from '@modules/account/domain/account.model'

export const makeFakeAccountModel = (): IAccountModel => ({
	id: 'any_account_id',
	balance: 100,
})
