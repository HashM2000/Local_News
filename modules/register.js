'use strict'

const sqlite = require('sqlite-async')
const bcrypt = require('bcrypt-promise')

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

module.exports = class register {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);'
			await this.db.run(sql)
			return this
		})()
	}


	async checkregister(user,pass) {
		try {
			if(user.length === 0) throw new Error('Field Required')
			if(pass.length === 0) throw new Error('Field Required')
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`users "${user}" already exists`)
			sql = `INSERT INTO users(user,pass) VALUES("${user}","${pass}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}


}


