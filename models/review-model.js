const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
	},
	review: {
		type: String,
		require: true,
		trim: true,
	},
	rating: {
		type: Number,
		require: true,
	},
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
