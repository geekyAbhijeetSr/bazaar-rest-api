const fs = require('fs')
const path = require('path')
const { HttpError } = require('../error')

const removeLocalFile = async filePath => {
	try {
		fs.unlink(filePath, err => {
			if (err && err.code == 'ENOENT') {
				console.log("Error! File doesn't exist.")
			} else if (err) {
				console.log('Something went wrong.')
			} else {
				console.log(`Successfully removed file with the path of ${filePath}`)
			}
		})
	} catch (err) {
		console.error(err)
	}
}

const capitalize = str => {
	return str[0].toUpperCase() + str.slice(1)
}

const categoriesToTree = (categories, parentId = null) => {
	const result = []
	let category

	if (parentId === null) {
		category = categories.filter(c => c.parentId == undefined)
	} else {
		category = categories.filter(c => {
			if (c.parentId) {
				return c.parentId.toString() == parentId.toString()
			}
		})
	}

	if (category) {
		for (const c of category) {
			result.push({
				_id: c._id,
				name: c.name,
				slug: c.slug,
				image: c.image,
				parentId: c.parentId,
				attributeCollection: c.attributeCollection,
				children: categoriesToTree(categories, c._id),
			})
		}
	}

	return result
}

const getExt = fileName => {
	const re = /(?:\.([^.]+))?$/
	return re.exec(fileName)[1]
}

const randomColor = () => {
	return Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, '0')
}

const avatarPlaceholder = (sprites, seed) => {
	const color = randomColor()
	return `https://avatars.dicebear.com/api/${sprites}/${seed}.svg?background=%23${color}`
	// Replace :sprites with male, female, human, identicon, initials, bottts, avataaars, jdenticon, gridy or micah.
	// The value of:seed can be anything you like - but don't use any sensitive or personal data here!
}

const uid = type => {
	switch (type) {
		case 'nano':
			return Math.random().toString(36).substring(4, 8)
		case 'short':
			return new Date().getTime().toString(36)
		case 'long':
			return (
				Math.random().toString(36).substring(2, 10) +
				new Date().getTime().toString(36) +
				Math.random().toString(36).substring(2, 10)
			)
		default:
			return (
				new Date().getTime().toString(36) +
				Math.random().toString(36).substring(2, 10)
			)
	}
}

const convertToSlug = (str, unique = false) => {
	const cleanStr1 = str
		.toLowerCase()
		.replace(/['’]/g, '')
		.replace(/&/g, ' and ')
		.replace(/₹/g, ' rupee')
		.replace(/₨/g, ' rupee')
		.replace(/\$/g, ' dollar')
		.replace(/€/g, ' euro')
		.replace(/£/g, ' pound')
		.replace(/¥/g, ' yen')
		.replace(/₩/g, ' won ')
		.replace(/₦/g, ' naira')
		.replace(/₱/g, ' peso')
		.replace(/₫/g, ' dong')
		.replace(/₭/g, ' kip')
		.replace(/₮/g, ' tugrik')
		.replace(/₺/g, ' lira')
		.replace(/₴/g, ' hryvnia')
		.replace(/₣/g, ' franc')
		.replace(/[^A-Za-z0-9,]/g, ' ')
		.trim()

	const strArr = cleanStr1.split(',')
	let cleanStr2 = strArr[0]

	if (strArr.length > 1) {
		for (let i = 0; i < strArr.length - 1; i++) {
			let digRe = /\d/
			let str1 = strArr[i]
			let str2 = strArr[i + 1]
			let lastIndex = str1.length - 1

			if (digRe.test(str1[lastIndex]) && digRe.test(str2[0])) {
				cleanStr2 = cleanStr2 + str2
			} else {
				cleanStr2 = cleanStr2 + ' ' + str2
			}
		}
	}

	let slug = cleanStr2.replace(/\s+/g, '-')

	if (unique) {
		slug = slug + '-' + uid('nano')
	}

	return slug
}

const removeOldFiles = (dir, milliseconds = 86400000, recursive = false) => {
	// 86400000 ms == 24 hours
	if (!fs.existsSync(dir)) return

	const files_n_dirs_array = fs.readdirSync(dir)

	files_n_dirs_array.forEach(file_or_dir => {
		const path_ = path.join(dir, file_or_dir)
		const stats = fs.statSync(path_)

		const now = new Date()
		const time = milliseconds

		if (stats.isFile() && now - stats.mtime > time) {
			removeLocalFile(path_)
		} else if (stats.isDirectory() && recursive) {
			removeOldFiles(path_, milliseconds, recursive)
		}
	})
}

function paginatedResponse(model) {
	return async (req, res, next) => {
		try {
			const page = req.query.page ? parseInt(req.query.page) : 1
			const limit = req.query.limit ? parseInt(req.query.limit) : 10

			const startIndex = (page - 1) * limit
			const endIndex = page * limit

			const results = {}
			
			const docs = await model.find().skip(startIndex).limit(limit)
			const totalDocs = await model.countDocuments()

			results.fetchedDocs = docs.length
			results.limit = limit
			results.totalDocs = totalDocs
			results.currentPage = page

			if (endIndex < totalDocs) {
				results.nextPage = page + 1
			}

			if (startIndex > 0) {
				results.previousPage = page - 1
			}

			results.docs = docs

			res.paginatedResults = results

			next()
		} catch (e) {
			const error = new HttpError(
				'Something went wrong, could not get paginated results.',
				500
			)
			return next(error)
		}
	}
}

function scopedPaginatedResponse(model) {
	return async (req, res, next) => {
		try {
			const page = req.query.page ? parseInt(req.query.page) : 1
			const limit = req.query.limit ? parseInt(req.query.limit) : 10

			const startIndex = (page - 1) * limit
			const endIndex = page * limit

			const results = {}
			let docs, totalDocs

			if (req.tokenPayload && req.tokenPayload.role === 'admin') {
				docs = await model.find({}).skip(startIndex).limit(limit)
				totalDocs = await model.countDocuments()
			} else {
				docs = await model
					.find({
						createdBy: req.tokenPayload.userId,
					})
					.skip(startIndex)
					.limit(limit)

				totalDocs = await model.countDocuments({
					createdBy: req.tokenPayload.userId,
				})
			}

			results.fetchedDocs = docs.length
			results.limit = limit
			results.totalDocs = totalDocs
			results.currentPage = page

			if (endIndex < totalDocs) {
				results.nextPage = page + 1
			}

			if (startIndex > 0) {
				results.previousPage = page - 1
			}

			results.docs = docs

			res.paginatedResults = results

			next()
		} catch (e) {
			const error = new HttpError(
				'Something went wrong, could not get paginated results.',
				500
			)
			return next(error)
		}
	}
}

module.exports = {
	removeLocalFile,
	capitalize,
	categoriesToTree,
	getExt,
	convertToSlug,
	uid,
	randomColor,
	avatarPlaceholder,
	removeOldFiles,
	paginatedResponse,
	scopedPaginatedResponse,
}
