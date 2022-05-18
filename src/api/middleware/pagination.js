const { HttpError } = require('../error')

exports.paginatedResponse = model => {
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

exports.scopedPaginatedResponse = model => {
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
