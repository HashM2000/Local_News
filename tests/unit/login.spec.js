
'use strict'

const accounts = require('../../modules/accounts.js')

describe('checkCredentials()', () => {
	test('returns true if valid username and password', async done => {
		expect.assertions(1)
		try {
			const result = await accounts.checkCredentials('jdoe', 'goodPassword')
			expect(result).toBe(true)
		} catch(err) {
			console.log(`ERROR: ${err.message}`)
		} finally {
			done()
		}
	})

	test('throws error if invalid username', async done => {
		expect.assertions(1)
		try {
			await accounts.checkCredentials('johndoe', 'goodPassword')

		} catch(err) {
			expect(err.message).toBe('invalid username')
		} finally {
			done()
		}
	})

	test('throws error if invalid password', async done => {
		expect.assertions(1)
		try {
			await accounts.checkCredentials('jdoe', 'badPassword')
		} catch(err) {
			expect(err.message).toBe('invalid password')
		} finally {
			done()
		}
	})
})

describe('addUser()', () => {
	// TODO
})
