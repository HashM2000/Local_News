#!/usr/bin/env node

/**
 * Routes File
 */

'use strict'

/* MODULE IMPORTS */
/* Use npm install to install all modules below! */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const sqlite = require('sqlite-async')
const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const nodemailer = require('nodemailer')
//const jimp = require('jimp')

const app = new Koa()
const router = new Router()
/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const port = 8080
const saltRounds = 10

router.get('/unauthorised', async ctx => await ctx.render('unauthorised'))
router.get('/live', async ctx => await ctx.render('live'))

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/default', async ctx => {
	try {
		const sql = 'SELECT Userid, Category, Title, Summary, Comment, Image, Date FROM Article ORDER BY id DESC;'
		const db = await sqlite.open('./website.db')
		const data = await db.all(sql)
		await db.close()
		console.log(data)
		await ctx.render('default', {Userid: 'Identification', Category: 'Field of news', Title: 'Heading', Summary: 'Short description', Comment: 'Explanation', Image: 'Title for image', Date: 'Current Date', Article: data})
	} catch(err) {
		ctx.body = err.message
	}
})*
// Index/Default directory
router.get('/', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/default')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}

	try {
		const sql = 'SELECT Userid, Category, Title, Summary, Comment, Image, Date FROM Article ORDER BY id DESC;'
		const db = await sqlite.open('./website.db')
		const data = await db.all(sql)
		await db.close()
		console.log(data)
		await ctx.render('index', {Userid: 'Identification', Category: 'Field of news', Title: 'Heading', Summary: 'Short description', Comment: 'Explanation', Image: 'Title for image', Date: 'Current Date', Article: data})
	} catch(err) {
		ctx.body = err.message
	}

})

router.get('/userarticles', async ctx => {
	try {
		console.log('/userarticles')
		const sql = 'SELECT Userid, Category, Title, Summary, Comment, Image, Date FROM Article ORDER BY id DESC;'
		const db = await sqlite.open('./website.db')
		const data = await db.all(sql)
		await db.close()
		console.log(data)
		await ctx.render('userarticles', {Userid: 'Identification', Category: 'Field of news', Title: 'Heading', Summary: 'Short description', Comment: 'Explanation', Image: 'Title for image', Date: 'Current Date', Article: data})
	} catch(err) {
		ctx.body = err.message
	}
})

router.get('/reviewspage', async ctx => {
	try {
		const sql = 'SELECT id,rtitle,Name,Stars,comment FROM reviews;'
		const db = await sqlite.open('./website.db')
		const data = await db.all(sql)
		await db.close()
		console.log(data)
		await ctx.render('reviewspage', {id: 'Identification', Name: 'creator name', Stars: 'Rating', Comment: 'message',rTitle: 'Review Title', review: data})
	} catch(err) {
		ctx.body = err.message
	}
})

// Search Functionality

router.get('/search', async ctx => {
	try {
		let sql = 'SELECT id, title FROM articles;'
		let querystring = ''
		console.log(ctx.query.q)
		if(ctx.query !== undefined && ctx.query.q !== undefined) {
			sql = `SELECT id, title FROM articles
							WHERE upper(title) LIKE "%${ctx.query.q}%" 
							OR upper(description) LIKE upper("%${ctx.query.q}%");`
			querystring = ctx.query.q
		}
		const db = await sqlite.open('./search.db')
		const data = await db.all(sql)
		await db.close()
		console.log(data)
		await ctx.render('searching', {books: data, query: querystring})
	} catch(err) {
		ctx.body = err.message
	}
})

router.get('/business', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/unauthorised')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('business')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/lifeandstyle', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/unauthorised')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('lifeandstyle')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/careers', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/unauthorised')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('careers')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


router.get('/sports', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/unauthorised')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('sports')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/music', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/unauthorised')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('music')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/entertainment', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/unauthorised')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('entertainment')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	data.countries = ['UK', 'Europe', 'World']
	await ctx.render('register', data)
})

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		console.log(body)
		// PROCESSING FILE
		const {path, type} = ctx.request.files.avatar
		const fileExtension = mime.extension(type)
		console.log(`path: ${path}`)
		console.log(`type: ${type}`)
		console.log(`fileExtension: ${fileExtension}`)
		await fs.copy(path, `public/avatars/${body.user}.png`)
		// ENCRYPTING PASSWORD AND BUILDING SQL
		body.pass = await bcrypt.hash(body.pass, saltRounds)
		const sql = `INSERT INTO users(user, pass) VALUES("${body.user}", "${body.pass}")`
		console.log(sql)
		// DATABASE COMMANDS
		const db = await sqlite.open('./website.db')
		await db.run(sql)
		await db.close()
		// REDIRECTING USER TO HOME PAGE
		ctx.redirect(`/?msg=new user "${body.user}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const db = await sqlite.open('./website.db')
		// DOES THE USERNAME EXIST?
		const records = await db.get(`SELECT count(id) AS count FROM users WHERE user="${body.user}";`)
		if(!records.count) return ctx.redirect('/login?msg=invalid%20username')
		const record = await db.get(`SELECT pass FROM users WHERE user = "${body.user}";`)
		await db.close()
		// DOES THE PASSWORD MATCH?
		const valid = await bcrypt.compare(body.pass, record.pass)
		if(valid === false) return ctx.redirect(`/login?user=${body.user}&msg=invalid%20passwosrd`)
		// WE HAVE A VALID USERNAME AND PASSWORD
		ctx.session.authorised = true
		ctx.session.user = body.user
		return ctx.redirect('/')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

// router.post('/login', async ctx => { // 19 lines reduced to 10!
// 	const body = ctx.request.body
// 	try {
// 		await accounts.checkCredentials(body.user, body.pass)
// 		ctx.session.authorised = true
// 		return ctx.redirect('/?msg=you are now logged in...')
// 	} catch(err) {
// 		return ctx.redirect(`/login?user=${body.user}&msg=${err.message}`)
// 	}
// })

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.user = null
	ctx.redirect('/')
})

app.use(router.routes())
module.exports = app.listen(port, async() => {
	// MAKE SURE WE HAVE A DATABASE WITH THE CORRECT SCHEMA
	const db = await sqlite.open('./website.db')
	await db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);')
	await db.close()
	console.log(`listening on port ${port}`)
})

router.get('/upload', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/unauthorised')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		data.user = ctx.session.user
		await ctx.render('upload', data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


router.post('/upload', koaBody, async ctx => {
// router.post('/upload', async ctx => {
	try {
		const body = ctx.request.body
		console.log(body)
		const db = await sqlite.open('./website.db')
		// PROCESSING FILE
		const {path, type} = ctx.request.files.picture
		const fileExtension = mime.extension(type)
		console.log(`path: ${path}`)
		console.log(`type: ${type}`)
		console.log(`fileExtension: ${fileExtension}`)
		await fs.copy(path, `public/articles/${body.image}.png`)
		const sql = `INSERT INTO Article(Userid, Category, Title, Summary, Comment, Image, Date)
		VALUES("${body.userid}", "${body.category}", "${body.title}", "${body.summary}", "${body.comment}", "${body.image}", date());`
		await db.run(sql)
		await db.close()
		return ctx.redirect('/upload?successMsg=You have successfully uploaded!')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


router.get('/reviews', async ctx => {
	const data = {}
	data.user = ctx.session.user
	await ctx.render('reviews', data)
})


router.post('/reviews', async ctx => {
	try {
		console.log(ctx.request.body)
		const body = ctx.request.body
		const db = await sqlite.open('./website.db')
		await db.run('CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT,Name TEXT, Stars integer, comment TEXT);')
		const sql = `INSERT INTO reviews (Name, stars, comment)
			VALUES("${body.name}", "${body.stars}", "${body.comment}");`
		await db.run(sql)
		await db.close()
		return ctx.redirect('/reviews?successMsg=You have successfully uploaded!')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


router.get('/contact', async ctx => {
	const data = {}
	data.user = ctx.session.user
	await ctx.render('contact', data)
})


router.post('/contact', async ctx => {

	console.log(ctx.request.body)
	const body = ctx.request.body
	const email = body.email
	const sub = body.sub
	const name = body.name
	const report = body.report

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			  user: 'localnewsspp@gmail.com',
			  pass: 'localnewssup123'
		}
		  })

		  const mailOptions = {

		from: 'localnewsspp@gmail.com',
		to: 'localnewsspp@gmail.com',
		subject: sub,
		text: `Email : ${ email }\n` + `From :${ name }\n` + `Subject : ${ body.sub }\n` + `Message : ${ report}`,

	}

		  transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			  console.log(error)
		} else {
			console.log(`Email sent: ${ info.response}`)

		}
		  })

		  ctx.redirect('/contact?successMsg=Report sent!')

})
