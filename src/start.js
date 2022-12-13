const server = require('./server')
const connectDB = require('./config/connectDB')
const { removeMulterUploads } = require('./config/multer_')

const PORT = process.env.PORT || 5000
	
;(async () => {
	await connectDB()
	server.listen(PORT, () => console.log(`Server started on port ${PORT}\n`))

	// =====================================================
	// Remove old files from uploads folder on an interval
	// =====================================================
	//
	// first argument: time of interval in milliseconds
	// second argument: time of how old files should be removed in milliseconds

	removeMulterUploads(1 * 60 * 60 * 1000, 1 * 60 * 60 * 1000)
})()
