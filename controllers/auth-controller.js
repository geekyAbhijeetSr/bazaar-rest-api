const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { HttpError } = require('../error')
const { User } = require('../models')

module.exports.signup = async (req, res, next) => {
	try {
		const { firstname, lastname, email, password } = req.body

		const userExist = await User.findOne({ email })

		if (userExist) {
			const error = new HttpError(`User with email ${email} already exist`, 422)
			return next(error)
		}

		let role = 'user'
		if (req.url === '/admin/signup') {
			role = 'admin'
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const user = await User.create({
			firstname,
			lastname,
			email,
			password: hashedPassword,
			role,
		})

		await user.save()

		const token = await jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		role = role[0].toUpperCase() + user.role.slice(1)

		res.status(201).json({
			message: `${role} created successfully`,
			token,
			user,
		})
	} catch (err) {
		const error = new HttpError('Signup failed, please try again.', 500)
		return next(error)
	}
}

module.exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			const error = new HttpError('Invalid Credentials', 401)
			return next(error)
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			const error = new HttpError('Invalid Credentials', 401)
			return next(error)
		}

		const token = await jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		let role = user.role[0].toUpperCase() + user.role.slice(1)

		res.status(200).json({
			message: `${role} logged in successfully`,
			token,
			user,
		})
	} catch (err) {
		const error = new HttpError('Login failed, please try again.', 500)
		return next(error)
	}
}
