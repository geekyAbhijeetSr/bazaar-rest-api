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

exports.signup = async (req, res, next) => {
	try {
		const { firstname, lastname, email, password } = req.body

		const userExist = await User.findOne({ email })

		if (userExist) {
			req.file && (await removeLocalFile(req.file.path))
			const error = new HttpError(`Email ${email} already exist.`, 422)
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
			const avatarUrl = avatarPlaceholder("initials", seed)

			newUserObj.avatar = {
				original: avatarUrl,
				thumbnail: avatarUrl,
			}
		}

		const user = await User.create(newUserObj)

		await user.save()

		const token = await user.generateAuthToken()

		user.password = undefined
		res.status(201).json({
			message: `${capitalize(user.role)} created successfully.`,
			token,
			user,
		})
	} catch (err) {
		req.file && (await removeLocalFile(req.file.path))
		const error = new HttpError('Signup failed, please try again.', 500)
		return next(error)
	}
}

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			const error = new HttpError('Invalid Credentials.', 401)
			return next(error)
		}

		if (req.url === '/login') {
			if (user.role !== 'user') {
				const error = new HttpError('Invalid Credentials.', 401)
				return next(error)
			}
		}
		else if (req.url === '/admin/login') {
			if (user.role !== 'admin') {
				const error = new HttpError('Access denied! you are not admin.', 403)
				return next(error)
			}
		}

		const passwordMatch = await user.comparePassword(password)

		if (!passwordMatch) {
			const error = new HttpError('Invalid Credentials.', 401)
			return next(error)
		}

		const token = await user.generateAuthToken()

		user.password = undefined
		res.status(200).json({
			message: `${capitalize(user.role)} logged in successfully.`,
			token,
			user,
		})
	} catch (err) {
		console.log(err)
		const error = new HttpError('Login failed, please try again.', 500)
		return next(error)
	}
}
