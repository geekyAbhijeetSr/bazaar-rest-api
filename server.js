const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {
	authRoutes,
	categoryRoutes,
	productRoutes,
	cartRoutes,
	attributeRoutes,
} = require('./routes')
const { errorHandler, unknownRoutesHandler } = require('./error')
const { start } = require('./helper')

const server = express()

server.use(express.json())
server.use(cookieParser())
server.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

server.use('/api/auth', authRoutes)
server.use('/api/attribute', attributeRoutes)
server.use('/api/category', categoryRoutes)
server.use('/api/product', productRoutes)
server.use('/api/cart', cartRoutes)

server.use(unknownRoutesHandler)

server.use(errorHandler)

start(server)
