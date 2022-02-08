const { HttpError } = require('../error')
const { Category } = require('../models')
const { categoriesToTree, convertToSlug } = require('../helper')

exports.createCategory = async (req, res, next) => {
	try {
		const { name } = req.body

		const categoryObj = {
			name,
			slug: convertToSlug(name, true),
		}

		if (req.body.parentId) {
			categoryObj.parentId = req.body.parentId
		}

		const category = await Category.create(categoryObj)

		await category.save()

		res.status(201).json({
			message: 'Category created successfully.',
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
			message: 'Categories fetched successfully.',
			categories,
			nestedCategories,
		})
	} catch (err) {
		const error = new HttpError(
			'Fetching categories failed, please try again.',
			500
		)
		return next(error)
	}
}

exports.updateCategory = async (req, res, next) => {
	try {
		const { name } = req.body
		const categoryObj = {
			name,
			slug: convertToSlug(name, true),
		}
		const category = await Category.findByIdAndUpdate(
			req.params.catId,
			categoryObj,
			{
				new: true,
			}
		)

		await category.save()

		res.status(200).json({
			message: 'Category updated successfully.',
			category,
		})
	} catch (err) {
		const error = new HttpError(
			'Updating category failed, please try again.',
			500
		)
		return next(error)
	}
}

exports.deleteCategory = async (req, res, next) => {
	try {
		const category = await Category.findById(req.params.catId)

		if (!category) {
			const error = new HttpError(
				'Category does not exist.',
				404
			)
			return next(error)
		}

		const subCategories = await Category.find({
			parentId: category._id,
		})

		if (subCategories.length > 0) {
			const error = new HttpError(
				'Category has sub-categories, please delete them first.',
				500
			)
			return next(error)
		}

		await Category.findByIdAndDelete(req.params.catId)

		res.status(200).json({
			message: 'Category deleted successfully.',
		})

	} catch (err) {
		const error = new HttpError(
			'Deleting category failed, please try again.',
			500
		)
		return next(error)
	}
}