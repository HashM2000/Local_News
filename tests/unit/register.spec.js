
const register = require('../../modules/register.js')

describe('checkregister', () => {

	test('returns true register fields are filled', async done => {
		expect.assertions(1)
		const reg = await new register()
		const checkregister = await reg.checkregister('john','password')
		expect(checkregister).toBe(true)
		done()

	})


	test('Error if no user given', async done => {
		expect.assertions(1)
		const reg = await new register()
		await expect(reg.checkregister('','password'))
			.rejects.toEqual(Error('Field Required'))
		done()
	})


	test('Error if no password given', async done => {
		expect.assertions(1)
		const reg = await new register()
		await expect(reg.checkregister('john',''))
			.rejects.toEqual(Error('Field Required'))
		done()
	})


})
