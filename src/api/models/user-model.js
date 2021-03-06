const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
			original: {
				type: String,
			},
			thumbnail: {
				type: String,
			},
			cloudinaryId: {
				type: String,
			},
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
			select: false,
		},
		role: {
			type: String,
			enum: ['admin', 'vendor', 'customer'],
			default: 'user',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

userSchema.pre('save', async function (next) {
	const user = this
	try {
		if (user.isModified('password')) {
			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(user.password, salt)
		}
		next()
	} catch (err) {
		next(err)
	}
})

userSchema.methods = {
	generateAuthToken: async function (expiresIn = '1h') {
		const user = this
		const token = await jwt.sign(
			{
				userId: user._id,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn }
		)
		return token
	},
	comparePassword: async function (password) {
		const user = this
		return await bcrypt.compare(password, user.password)
	},
}

const User = mongoose.model('User', userSchema)

module.exports = User
