const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		image: {
			url: {
				type: String,
				trim: true,
			},
			cloudinaryId: {
				type: String,
				trim: true,
			},
		},
		attributeCollection: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AttributeCollection',
		},
		parentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
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

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
