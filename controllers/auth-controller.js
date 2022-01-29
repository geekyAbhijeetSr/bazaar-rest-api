const { HttpError } = require('../error')
const { User } = require('../models')
const { capitalize } = require('../helper')

exports.signup = async (req, res, next) => {
	try {
		const { firstname, lastname, email, password } = req.body

		const userExist = await User.findOne({ email })

		if (userExist) {
			const error = new HttpError(`Email ${email} already exist`, 422)
			return next(error)
		}

		let role = 'user'
		if (req.url === '/admin/signup') {
			role = 'admin'
		}

		const user = await User.create({
			firstname,
			lastname,
			email,
			password,
			role,
		})

		await user.save()

		const token = await user.generateAuthToken()

		res.status(201).json({
			message: `${capitalize(user.role)} created successfully`,
			token,
			user,
		})
	} catch (err) {
		const error = new HttpError('Signup failed, please try again.', 500)
		return next(error)
	}
}

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			const error = new HttpError('Invalid Credentials', 401)
			return next(error)
		}

		if (req.url === '/admin/login') {
			if (user.role !== 'admin') {
				const error = new HttpError('Access denied! you are not admin', 403)
				return next(error)
			}
		}

		const passwordMatch = await user.comparePassword(password)

		if (!passwordMatch) {
			const error = new HttpError('Invalid Credentials', 401)
			return next(error)
		}

		const token = await user.generateAuthToken()

		res.status(200).json({
			message: `${capitalize(user.role)} logged in successfully`,
			token,
			user,
		})
	} catch (err) {
		const error = new HttpError('Login failed, please try again.', 500)
		return next(error)
	}
}
