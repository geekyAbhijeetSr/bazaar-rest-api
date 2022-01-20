const express = require('express')

const {start, unknownRoutesHandler} = require('./helper')
const { errorHandler } = require('./error')
const { authRoutes } = require('./routes')

const server = express()

server.use(express.json())

server.use('/api/auth', authRoutes)

server.use(unknownRoutesHandler)

server.use(errorHandler)

start(server)
