const mongoose = require('mongoose')
const {
	fs_: { removeOldFiles },
} = require('../api/helper')

const URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

const start = async server => {
	try {
		await mongoose.connect(URI)
		console.log('\nConnected to MongoDB')
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}\n`)
		})

		const intervalTime = 1 * 60 * 60 * 1000 // interval will run every 1 hour
		const time = 1 * 60 * 60 * 1000 // 1 hour and more than 1 hour old files will be removed

		setInterval(async () => {
			removeOldFiles('uploads', time, true)
		}, intervalTime)
	} catch (err) {
		console.error(err)
	}
}

module.exports = start
