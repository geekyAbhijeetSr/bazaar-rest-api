const { HttpError } = require('../error')
const { User } = require('../models')
const {
	utils: { capitalize, avatarPlaceholder },
	fs_: { removeLocalFile },
} = require('../helper')
const {
	cloudinary_: { compressImage, uploadToCloudinary, cloudinaryUrlTransformer },
} = require('../../config')
const {
	constants: { EXPIRES_IN },
} = require('../../config')

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

		let role = 'customer'
		if (req.url === '/dashboard/signup') {
			role = 'vendor'
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
			const result = await uploadToCloudinary(compressedImgPath, 'users')
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

		const token = await user.generateAuthToken(EXPIRES_IN)

		user.password = undefined
		res
			.status(201)
			.cookie('jwt', token, {
				httpOnly: true,
				sameSite: 'strict',
				maxAge: EXPIRES_IN,
			})
			.json({
				message: `${capitalize(user.role)} registered successfully`,
				user,
				exp: new Date().getTime() + EXPIRES_IN,
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

		const token = await user.generateAuthToken(EXPIRES_IN)

		user.password = undefined
		res
			.status(200)
			.cookie('jwt', token, {
				httpOnly: true,
				sameSite: 'strict',
				maxAge: EXPIRES_IN,
			})
			.json({
				message: 'Logged in successfully',
				user,
				exp: new Date().getTime() + EXPIRES_IN,
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
