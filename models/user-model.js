const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
			trim: true,
		},
		lastname: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
            minlength: 6,
            select: false
		},
		role: {
			type: String,
			enum: ['user', 'admin', 'superadmin'],
			default: 'user',
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

const User = mongoose.model('User', userSchema)

module.exports = User
