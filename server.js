const express = require('express')

const { start, unknownRoutesHandler } = require('./helper')
const { errorHandler } = require('./error')
const { authRoutes, categoryRoutes } = require('./routes')

const server = express()

server.use(express.json())

server.use('/api/auth', authRoutes)
server.use('/api/category', categoryRoutes)

server.use(unknownRoutesHandler)

server.use(errorHandler)

start(server)
