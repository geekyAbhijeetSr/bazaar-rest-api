const { HttpError } = require('../error')
const { User } = require('../models')
const {
	capitalize,
	compressImage,
	uploadToCloudinary,
	cloudinaryUrlTransformer,
	removeLocalFile,
	avatarPlaceholder,
} = require('../helper')

const expiresIn = 24 * 60 * 60 * 1000

exports.signup = async (req, res, next) => {
	try {
		let { firstname, lastname, email, password } = req.body
		email = email.toLowerCase()

		const userExist = await User.findOne({ email })

		if (userExist) {
			req.file && removeLocalFile(req.file.path)
			const error = new HttpError(`Email already exist`, 422)
			return next(error)
		}

		let role = 'user'
		if (req.url === '/admin/signup') {
			role = 'admin'
		}

		const newUserObj = {
			firstname,
			lastname,
			email,
			password,
			role,
		}

		if (req.file) {
			const compressedImgPath = await compressImage(req.file.path, 400, 400)
			const result = await uploadToCloudinary(compressedImgPath)
			const url = result.secure_url
			const publicId = result.public_id

			newUserObj.avatar = {
				original: cloudinaryUrlTransformer(url, 'avatar'),
				thumbnail: cloudinaryUrlTransformer(url, 'avatar_small'),
				cloudinaryId: publicId,
			}
		} else {
			let seed = firstname[0]
			const avatarUrl = avatarPlaceholder('initials', seed)

			newUserObj.avatar = {
				original: avatarUrl,
				thumbnail: avatarUrl,
			}
		}

		const user = new User(newUserObj)

		await user.save()

		const token = await user.generateAuthToken(expiresIn)

		user.password = undefined
		res
			.status(201)
			.cookie('jwt', token, {
				httpOnly: true,
				sameSite: 'strict',
				maxAge: expiresIn,
			})
			.json({
				message: `${capitalize(user.role)} created successfully`,
				user,
				exp: new Date().getTime() + expiresIn,
			})
	} catch (err) {
		req.file && removeLocalFile(req.file.path)
		const error = new HttpError('Signup failed', 500)
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

		if (req.url === '/login') {
			if (user.role !== 'user') {
				const error = new HttpError('Access denied!', 401)
				return next(error)
			}
		} else if (req.url === '/admin/login') {
			if (user.role !== 'admin') {
				const error = new HttpError('Access denied!', 403)
				return next(error)
			}
		}

		const passwordMatch = await user.comparePassword(password)

		if (!passwordMatch) {
			const error = new HttpError('Invalid Credentials', 401)
			return next(error)
		}

		const token = await user.generateAuthToken(expiresIn)

		user.password = undefined
		res
			.status(200)
			.cookie('jwt', token, {
				httpOnly: true,
				sameSite: 'strict',
				maxAge: expiresIn,
			})
			.json({
				message: 'Logged in successfully',
				user,
				exp: new Date().getTime() + expiresIn,
			})
	} catch (err) {
		const error = new HttpError('Login failed', 500)
		return next(error)
	}
}

exports.logout = async (req, res, next) => {
	try {
		res.clearCookie('jwt')
		res.status(200).json({ message: 'Logged out successfully' })
	} catch (err) {
		const error = new HttpError('Logout failed', 500)
		return next(error)
	}
}
