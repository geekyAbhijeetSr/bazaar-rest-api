const express = require('express')
const { authRoutes, categoryRoutes } = require('./routes')
const { errorHandler, unknownRoutesHandler } = require('./error')
const { start } = require('./helper')

const server = express()

server.use(express.json())

server.use('/api/auth', authRoutes)
server.use('/api/category', categoryRoutes)

server.use(unknownRoutesHandler)

server.use(errorHandler)

start(server)
