const express = require('express')
const { authRoutes, categoryRoutes, productRoutes } = require('./routes')
const { errorHandler, unknownRoutesHandler } = require('./error')
const { start } = require('./helper')

const server = express()

server.use(express.json())

server.use('/api/auth', authRoutes)
server.use('/api/category', categoryRoutes)
server.use('/api/product', productRoutes)

server.use(unknownRoutesHandler)

server.use(errorHandler)

start(server)
