const mongoose = require('mongoose')

const attributeCollectionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
	attributes: [
		{
			name: {
				type: String,
				required: true,
				trim: true,
			},
			type: {
				type: String,
				required: true,
				enum: ['text', 'text-array'],
				default: 'Text',
				trim: true,
			},
			placeholder: {
				type: String,
				required: true,
				trim: true,
            },
            active: {
                type: Boolean,
                default: true,
            },
		},
	],
})

const AttributeCollection = mongoose.model('AttributeCollection', attributeCollectionSchema)

module.exports = AttributeCollection
