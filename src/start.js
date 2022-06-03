const connectDB = require('./config/connectDB')
const server = require('./server')

const PORT = process.env.PORT || 5000

;(async () => {
	await connectDB()
	server.listen(PORT, () => console.log(`Server started on port ${PORT}\n`))
})()