const jwt = require('jsonwebtoken')
const { HttpError } = require('../error')
const { User } = require('../models')

exports.verifyToken = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN'
		if (!token) {
			const error = new HttpError(
				'Authentication failed! you are not logged in.',
				401
			)
			return next(error)
		}
		const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
		req.tokenPayload = { userId: decodedToken.userId, role: decodedToken.role }
		next()
	} catch (err) {
		const error = new HttpError(
			'Authentication failed! you are not logged in.',
			401
		)
		next(error)
	}
}

exports.isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.tokenPayload.userId)
		if (!user) {
			const error = new HttpError('User not found', 404)
			return next(error)
		}
		if (req.tokenPayload.role !== 'admin') {
			const error = new HttpError('Access denied! you are not admin.', 403)
			return next(error)
		}
		next()
	} catch (err) {
		const error = new HttpError()
		next(error)
	}
}

exports.isUser = async (req, res, next) => {
	try {
		const { userId, role } = req.tokenPayload
		const user = await User.findById(userId)
		if (!user) {
			const error = new HttpError('User not found', 404)
			return next(error)
		}
		if (role !== 'user') {
			const error = new HttpError('Access denied! you are not user.', 403)
			return next(error)
		}
		next()
	} catch (err) {
		const error = new HttpError()
		next(error)
	}
}
