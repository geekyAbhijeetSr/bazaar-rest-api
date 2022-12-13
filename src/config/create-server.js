const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

function createServer() {
	const server = express()

	server.use(express.json())
	server.use(express.urlencoded({ extended: true }))
	server.use(cookieParser())
	server.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

	return server
}

module.exports = createServer
