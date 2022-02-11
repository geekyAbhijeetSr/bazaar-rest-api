const mongoose = require('mongoose')
const { removeOldFiles } = require('./utils') 

const URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

const start = async server => {
	try {
		await mongoose.connect(URI)
		console.log('Connected to MongoDB')
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})

		const intervalTime = 1 * 60 * 60 * 1000
		const time = 60 * 60 * 1000
		removeOldFiles('uploads', time, true)
		setInterval(() => {
			removeOldFiles('uploads/')
		}, intervalTime)

	} catch (err) {
		console.error(err)
	}
}

module.exports = start
