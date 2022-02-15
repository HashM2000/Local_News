
const uploadart = require('../../modules/upload.js')

describe('checkarticledb', () => {

	test('returns true if fields from Article db are all filled', async done => {
		expect.assertions(1)
		const upload = await new uploadart()
		const checkarticle = await upload.checkarticle('john', 'Doe','Brexit','idk','Leaving EU')
		expect(checkarticle).toBe(true)
		done()

	})

	test('Error if no First_Name given', async done => {
		expect.assertions(1)
		const upload = await new uploadart()
		await expect(upload.checkarticle('', 'Doe', 'Brexit', 'idk', 'Leaving EU'))
			.rejects.toEqual(Error('Field Required'))
		done()
	})

	test('Error if no Last_name given', async done => {
		expect.assertions(1)
		const upload = await new uploadart()
		await expect(upload.checkarticle('John', '', 'Brexit', 'idk', 'Leaving EU'))
			.rejects.toEqual(Error('Field Required'))
		done()
	})
	test('Error if no Title given', async done => {
		expect.assertions(1)
		const upload = await new uploadart()
		await expect(upload.checkarticle('John', 'Doe', 'Brexit', '', 'Leaving EU'))
			.rejects.toEqual(Error('Field Required'))
		done()
	})
	test('Error if no Text given', async done => {
		expect.assertions(1)
		const upload = await new uploadart()
		await expect(upload.checkarticle('John', '', 'Brexit', 'idk', ''))
			.rejects.toEqual(Error('Field Required'))

		done()
	})
})


