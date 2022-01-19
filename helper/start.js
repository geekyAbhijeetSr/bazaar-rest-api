const mongoose = require('mongoose')

const URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

const start = async server => {
	try {
		await mongoose.connect(URI)
		console.log('Connected to MongoDB')
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	} catch (err) {
		console.error(err)
	}
}

module.exports = start
