const { createServer } = require('./config')
const routes = require('./api/routes')
const {
	multer_: { removeUploadsOnInterval },
} = require('./config')
const { errorHandler, unknownRoutesHandler } = require('./api/error')

const server = createServer()

server.use('/api/auth', routes.authRoutes)
server.use('/api/attribute', routes.attributeRoutes)
server.use('/api/category', routes.categoryRoutes)
server.use('/api/product', routes.productRoutes)
server.use('/api/cart', routes.cartRoutes)

server.use(unknownRoutesHandler)

server.use(errorHandler)

module.exports = server

// =====================================================
// Remove old files from uploads folder on an interval
// =====================================================
//
// first argument: time of interval in milliseconds
// second argument: time of how old files should be removed in milliseconds

removeUploadsOnInterval(1 * 60 * 60 * 1000, 1 * 60 * 60 * 1000)
