const mongoose = require('mongoose')

const PORT = process.env.PORT || 8080

const start = async (server) => {
    try {
        // await mongoose.connect(URI)
        // console.log('Connected to MongoDB')
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (err) {
        console.error(err)
    }
}

module.exports = start