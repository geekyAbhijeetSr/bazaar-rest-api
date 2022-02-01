const { HttpError } = require('../error')
const slugify = require('slugify')
const { Category } = require('../models')
const { categoriesToTree } = require('../helper')

exports.createCategory = async (req, res, next) => {
	try {
		const { name } = req.body
		const slug = slugify(name, {
			replacement: '-',
			remove: /[*+~.()'"!:@]/g,
			lower: true,
		})

		const categoryObj = {
			name,
			slug,
		}

		if (req.body.parentId) {
			categoryObj.parentId = req.body.parentId
		}

		const category = await Category.create(categoryObj)

		await category.save()

		res.status(201).json({
			message: 'Category created successfully',
			category,
		})
	} catch (err) {
		const error = new HttpError(
			'Creating category failed, please try again.',
			500
		)
		return next(error)
	}
}

exports.getCategories = async (req, res, next) => {
	try {
		const categories = await Category.find({})
		const nestedCategories = categoriesToTree(categories)
		res.status(200).json({
			message: 'Categories fetched successfully',
			categories,
			nestedCategories,
		})
	} catch (err) {
		console.log(err)
		const error = new HttpError(
			'Fetching categories failed, please try again.',
			500
		)
		return next(error)
	}
}
