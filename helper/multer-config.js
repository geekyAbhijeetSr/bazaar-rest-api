const multer = require('multer')
const fs = require('fs')
const { HttpError } = require('../error')
const { getExt, uid } = require('./utils')

if (!fs.existsSync('./uploads/compressed')) {
	fs.mkdirSync('./uploads/compressed', { recursive: true })
}

const errorMessage = {
	LIMIT_FILE_SIZE: 'File size is too big!',
	LIMIT_UNEXPECTED_FILE: 'Unexpected file!',
	LIMIT_FIELD_KEY: 'Too many files!',

	// custom error
	FILE_TYPE_ERROR: 'File type is not allowed!',
	DEFAULT_ERROR: 'File upload failed!',
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	},
	filename: function (req, file, cb) {
		const ext = getExt(file.originalname)
		if (!ext) {
			req.multerError = errorMessage['FILE_TYPE_ERROR']
			cb(null, false)
		}
		const filename = `${uid()}.${ext}`
		cb(null, filename)
	},
})

const fileFilter = (req, file, cb) => {
	var allowedMimes = [
		'image/jpeg',
		'image/pjpeg',
		'image/png',
		'image/gif',
		'image/svg+xml',
		'image/webp',
	]
	
	if (allowedMimes.includes(file.mimetype)) return cb(null, true)

	req.multerError = errorMessage['FILE_TYPE_ERROR']
	return cb(null, false)
}

const limits = {
	fileSize: 5 * 1024 * 1024, // Max file size in bytes (5mb)
}

const multerObj = {
	storage,
	limits,
	fileFilter,
}

exports.multerUploadFile = (req, res, next) => {
	const upload = multer(multerObj).single('image')

	upload(req, res, function (err) {
		if (err && !req.multerError) {
			const message = errorMessage[err.code] || errorMessage['DEFAULT_ERROR']
			req.multerError = message
		}
		return next()
	})
}

exports.multerUploadFiles = (req, res, next) => {
	const upload = multer(multerObj).array('image', 12)

	upload(req, res, function (err) {
		if (err && !req.multerError) {
			const message = errorMessage[err.code] || errorMessage['DEFAULT_ERROR']
			req.multerError = message
		}
		return next()
	})
}

exports.multerValidate = (req, res, next) => {
	if (req.multerError) {
		const error = new HttpError(req.multerError, 400)
		return next(error)
	}
	return next()
}
