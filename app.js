const express = require ('express')
const ejs = require ('ejs')
const bodyParser = require ('body-parser')
const {Client} = require('pg')
const app = express()
const dotenv = require('dotenv')

dotenv.load();
const postgres_user = process.env.DB_USER;
const postgres_pass = process.env.DB_PASS;

const connectionString = `postgresql://${postgres_user}:${postgres_pass}@localhost:5432/bulletin_board`

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

app.set('view engine', 'ejs')

// ==========READ the messages
app.get('/', (req, res)=>{
	const client = new Client({
		connectionString: connectionString,
	})
	client.connect()
	.then(()=>{
		return client.query(`SELECT * FROM messages`)
	})
	.then((result)=>{
		return res.render('messages', {result})
	})
})

// ==========
app.post('/add/message', (req, res)=>{
	const client = new Client({
		connectionString: connectionString,
	})
	client.connect()
	.then(()=>{
		return client.query(`INSERT INTO messages (title, body) values ($1, $2)`, [req.body.title, req.body.body])
	.then((result)=>{
		return res.redirect('/')
		})
	})
})







app.listen(3000, ()=>{
	console.log('Server running on port 3000...')
})