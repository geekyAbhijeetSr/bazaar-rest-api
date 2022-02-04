const multer = require('multer')
const fs = require('fs')
const { HttpError } = require('../error')
const { getExt } = require('./utils')

if (!fs.existsSync('./uploads/compressed')) {
	fs.mkdirSync('./uploads/compressed', { recursive: true })
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	},
	filename: function (req, file, cb) {
		const ext = getExt(file.originalname)
		if (!ext) return cb(new HttpError('Invalid file extension', 422))
		const filename = `${Date.now()}.${ext}`
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

	cb(new HttpError('Invalid file type!', 400), false)
}

const limits = {
	fileSize: 5 * 1024 * 1024, // Max file size in bytes (5mb)
}

const obj = {
	storage,
	limits,
	fileFilter,
}

exports.multerUploadFile = (req, res, next) => {
	const upload = multer(obj).single('image')

	upload(req, res, function (err) {
		if (err) {
			if (err.code == 'LIMIT_FILE_SIZE') {
				const error = new HttpError('File size is too big!', 400)
				return next(error)
			}
		}

		return next()
	})
}
