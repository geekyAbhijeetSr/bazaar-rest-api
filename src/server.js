const createServer = require('./config/create-server')
const routes = require('./api/routes')
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
