const mongoose = require('mongoose')

const imageObjSchema = {
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
}

const categoryObjSchema = {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Category',
	require: true,
}

const productSchema = new mongoose.Schema(
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
		images: {
			image_main: imageObjSchema,
			image_1: imageObjSchema,
			image_2: imageObjSchema,
			image_3: imageObjSchema,
			image_4: imageObjSchema,
			image_5: imageObjSchema,
		},
		description: {
			type: String,
			require: true,
			trim: true,
		},
		category: {
			topLevel: categoryObjSchema,
			secondLevel: categoryObjSchema,
			thirdLevel: categoryObjSchema,
		},
		properties: [
			{
				name: {
					type: String,
					trim: true,
				},
				value: {
					type: String,
					trim: true,
				},
			},
		],
		mrp: {
			type: Number,
			require: true,
		},
		price: {
			type: Number,
			require: true,
		},
		stock: {
			type: Number,
			require: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
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
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product
