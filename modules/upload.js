'use strict'

const sqlite = require('sqlite-async')


async function runSQL(query) {
	try {
		console.log(query)
		const DBName = './website.db'
		const db = await sqlite.open(DBName)
		const data = await db.all(query)
		await db.close()
		if(data.length === 1) return data[0]
		return data
	} catch(err) {
		throw err
	}

}

module.exports = class uploadart {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS Article (First_Name TEXT PRIMARY KEY, Last_name TEXT, Category TEXT ,Title TEXT, Text TEXT)'
			await this.db.run(sql)
			return this
		})()
	}


	async checkarticle(First_Name,Last_name,Category,Title,Text) {
		try {
			if(First_Name.length === 0) throw new Error('Field Required')
			if(Last_name.length === 0) throw new Error('Field Required')
			if(Title.length === 0) throw new Error('Field Required')
			if(Text.length === 0) throw new Error('Field Required')
			let sql = `SELECT COUNT(First_Name) as records FROM Article WHERE First_Name="${First_Name}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`Article "${First_Name}" already exists`)
			sql = `INSERT INTO Article(First_Name, Last_name, Category ,Title, Text) VALUES("${First_Name}", "${Last_name}", "${Category}" , "${Title}", "${Text}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}


}


