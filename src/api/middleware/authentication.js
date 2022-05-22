const jwt = require('jsonwebtoken')
const { HttpError } = require('../error')
const { User } = require('../models')
const {
	utils: { capitalize },
} = require('../helper')

exports.verifyToken = async (req, res, next) => {
	try {
		const token = req.cookies.jwt

		if (!token) {
			const error = new HttpError('Authentication failed!', 401)
			return next(error)
		}
		const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
		req.tokenPayload = { userId: decodedToken.userId, role: decodedToken.role }
		next()
	} catch (err) {
		res.clearCookie('jwt')
		const error = new HttpError('Authentication failed!', 401)
		next(error)
	}
}

exports.authRole = roles => {
	return async (req, res, next) => {
		try {
			const user = await User.findById(req.tokenPayload.userId)
			if (!user) {
				const error = new HttpError(`${capitalize(user)} not found`, 404)
				return next(error)
			}
			if (!roles.includes(user.role)) {
				const error = new HttpError(`Access denied! you are not ${roles}.`, 403)
				return next(error)
			}
			req.user = user
			next()
		} catch (err) {
			const error = new HttpError()
			next(error)
		}
	}
}
