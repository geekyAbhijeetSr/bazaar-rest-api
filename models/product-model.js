const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
			trim: true,
		},
		slug: {
			type: String,
			require: true,
			unique: true,
		},
		brand: {
			type: String,
			require: true,
			trim: true,
		},
		productImages: [
			{
				original: {
					type: String,
					require: true,
				},
				thumbnail: {
					type: String,
					require: true,
				},
				cloudinaryId: {
					type: String,
					require: true,
				},
			},
		],
		description: {
			type: String,
			require: true,
			trim: true,
		},
		properties: [
			{
				name: {
					type: String,
					require: true,
					trim: true,
				},
				value: {
					type: String,
					require: true,
					trim: true,
				},
			},
		],
		price: {
			type: Number,
			require: true,
		},
		mrp: {
			type: Number,
			require: true,
		},
		rating: {
			type: Number,
			default: 0,
		},
		noOfReviews: {
			type: Number,
			default: 0,
		},
		stock: {
			type: Number,
			require: true,
		},
		category: [
			{
				type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                require: true
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
        },
	},

	{
		timestamps: true,
	}
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product
