const express = require('express')
const {start, unknownRoutesHandler} = require('./helper')
const { errorHandler } = require('./error')

const server = express()

server.get('/', (req, res) => {
	res.send('Hello World from server')
})

server.use(unknownRoutesHandler)

server.use(errorHandler)

start(server)
