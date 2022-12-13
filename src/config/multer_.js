const multer = require('multer')
const fs = require('fs')
const { HttpError } = require('../api/error')
const { uid } = require('../api/helper/utils')
const { getExt, removeOldFiles } = require('../api/helper/fs_')
const { UPLOAD_DIR } = require('./constants')

const errorMessage = {
	LIMIT_FILE_SIZE: 'File size should not be more than 2MB',
	LIMIT_UNEXPECTED_FILE: 'Unexpected file!',
	LIMIT_FIELD_KEY: 'Too many files!',

	// custom error
	FILE_TYPE_ERROR: 'File type is not allowed!',
	DEFAULT_ERROR: 'File upload failed!',
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (!fs.existsSync(`${UPLOAD_DIR}/compressed`)) {
			fs.mkdirSync(`${UPLOAD_DIR}/compressed`, { recursive: true })
		}
		cb(null, UPLOAD_DIR)
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
	const allowedMimes = [
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
	fileSize: 2 * 1024 * 1024, // Max file size in bytes (2mb)
}

const multerObj = {
	storage,
	limits,
	fileFilter,
}

exports.multerUploadFile = name => {
	return (req, res, next) => {
		const upload = multer(multerObj).single(name)

		upload(req, res, function (err) {
			if (err && !req.multerError) {
				const message = errorMessage[err.code] || errorMessage['DEFAULT_ERROR']
				req.multerError = message
			}
			return next()
		})
	}
}

exports.multerUploadMultiFile = fields => {
	return (req, res, next) => {
		// fields example:
		// 	[
		// 		{ name: 'avatar', maxCount: 1 },
		// 		{ name: 'gallery', maxCount: 8 }
		// 	]
		const upload = multer(multerObj).fields(fields)

		upload(req, res, function (err) {
			if (err && !req.multerError) {
				const message = errorMessage[err.code] || errorMessage['DEFAULT_ERROR']
				req.multerError = message
			}
			return next()
		})
	}
}

exports.multerUploadFiles = (fieldName, maxCount) => {
	return (req, res, next) => {
		const upload = multer(multerObj).array(fieldName, maxCount)

		upload(req, res, function (err) {
			if (err && !req.multerError) {
				const message = errorMessage[err.code] || errorMessage['DEFAULT_ERROR']
				req.multerError = message
			}
			return next()
		})
	}
}

exports.multerValidate = (req, res, next) => {
	if (req.multerError) {
		const error = new HttpError(req.multerError, 400)
		return next(error)
	}
	return next()
}

exports.removeMulterUploads = async (intervalTime, time = 60 * 60 * 1000) => {
	// intervalTime: time of interval in milliseconds
	// time: time of how old files should be removed in milliseconds
	setInterval(async () => {
		removeOldFiles(UPLOAD_DIR, time, true)
	}, intervalTime)
}
