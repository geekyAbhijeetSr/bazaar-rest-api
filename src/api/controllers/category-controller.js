const { HttpError } = require('../error')
const { Category } = require('../models')
const { convertToSlug, categoriesToTree } = require('../helper/utils')
const { removeLocalFile } = require('../helper/fs_')
const {
	compressImage,
	uploadToCloudinary,
	deleteFromCloudinary,
	cloudinaryUrlTransformer,
} = require('../../config/cloudinary_')

exports.createCategory = async (req, res, next) => {
	try {
		const { name, parentId, attributeCollection } = req.body

		const categoryObj = {
			name,
		}

		if (parentId) {
			const parentCategory = await Category.findById(parentId)
			if (!parentCategory) {
				const error = new HttpError('Parent category not found', 404)
				return next(error)
			}
			categoryObj.parentId = parentCategory._id
			categoryObj.slug =
				convertToSlug(name) + '-' + convertToSlug(parentCategory.name)
		} else {
			categoryObj.slug = convertToSlug(name)
		}

		const existCategory = await Category.findOne({
			slug: categoryObj.slug,
		})

		if (existCategory) {
			const error = new HttpError('Category already exist', 422)
			return next(error)
		}

		attributeCollection &&
			(categoryObj.attributeCollection = attributeCollection)

		if (req.file) {
			const compressedImgPath = await compressImage(req.file.path, 450, 450)
			const result = await uploadToCloudinary(compressedImgPath, 'categories')
			const url = result.secure_url
			const publicId = result.public_id

			categoryObj.image = {
				url: cloudinaryUrlTransformer(url, 'q_good'),
				cloudinaryId: publicId,
			}
		}

		const category = new Category(categoryObj)

		await category.save()

		await Category.populate(category, {
			path: 'attributeCollection',
		})

		res.status(201).json({
			message: 'Category added successfully',
			category,
		})
	} catch (err) {
		req.file && removeLocalFile(req.file.path)
		const error = new HttpError('Creating category failed', 500)
		return next(error)
	}
}

exports.getCategories = async (req, res, next) => {
	try {
		const categories = await Category.find({})
		await Category.populate(categories, {
			path: 'attributeCollection',
		})
		const nestedCategories = categoriesToTree(categories)
		res.status(200).json({
			message: 'Categories fetched successfully',
			categories,
			nestedCategories,
		})
	} catch (err) {
		const error = new HttpError('Fetching categories failed', 500)
		return next(error)
	}
}

exports.updateCategory = async (req, res, next) => {
	try {
		const { name, attributeCollection } = req.body
		const { catId } = req.params

		const foundCat = await Category.findById(catId)

		if (!foundCat) {
			const error = new HttpError('Category not found', 404)
			return next(error)
		}

		if (foundCat.parentId) {
			const parentCategory = await Category.findById(foundCat.parentId)
			if (!parentCategory) {
				const error = new HttpError('Parent category not found', 404)
				return next(error)
			}
			foundCat.slug =
				convertToSlug(name) + '-' + convertToSlug(parentCategory.name)
		} else {
			foundCat.slug = convertToSlug(name)
		}

		const existCategory = await Category.findOne({
			slug: foundCat.slug,
		})

		if (existCategory && existCategory._id.toString() !== catId) {
			const error = new HttpError('Category already exist', 422)
			return next(error)
		}

		foundCat.name = name
		attributeCollection && (foundCat.attributeCollection = attributeCollection)

		if (req.file) {
			await deleteFromCloudinary(foundCat.image.cloudinaryId)
			const compressedImgPath = await compressImage(req.file.path, 450, 450)
			const result = await uploadToCloudinary(compressedImgPath, 'categories')
			const url = result.secure_url
			const publicId = result.public_id

			foundCat.image = {
				url: cloudinaryUrlTransformer(url, 'q_good'),
				cloudinaryId: publicId,
			}
		}

		await foundCat.save()

		await Category.populate(foundCat, {
			path: 'attributeCollection',
		})

		res.status(200).json({
			message: 'Category updated successfully',
			category: foundCat,
		})
	} catch (err) {
		const error = new HttpError('Updating category failed', 500)
		return next(error)
	}
}

exports.toggleActiveCategory = async (req, res, next) => {
	try {
		const category = await Category.findById(req.params.catId)

		if (!category) {
			const error = new HttpError('Category does not exist', 404)
			return next(error)
		}

		category.active = !category.active

		await category.save()

		await Category.populate(category, {
			path: 'attributeCollection',
		})

		res.status(200).json({
			message: 'Category updated successfully',
			category,
		})
	} catch (err) {
		const error = new HttpError('Updating category failed', 500)
		return next(error)
	}
}

exports.deleteCategory = async (req, res, next) => {
	try {
		const category = await Category.findById(req.params.catId)

		if (!category) {
			const error = new HttpError('Category does not exist', 404)
			return next(error)
		}

		const subCategories = await Category.find({
			parentId: category._id,
		})

		if (subCategories.length > 0) {
			const error = new HttpError('Category has sub categories', 500)
			return next(error)
		}

		if (category?.image?.cloudinaryId) {
			const result = await deleteFromCloudinary(category.image.cloudinaryId)
		}

		await Category.findByIdAndDelete(req.params.catId)

		res.status(200).json({
			message: 'Category removed successfully',
			categoryId: req.params.catId,
		})
	} catch (err) {
		if (err.kind === 'ObjectId') {
			const error = new HttpError('Category does not exist', 404)
			return next(error)
		}
		const error = new HttpError('Deleting category failed', 500)
		return next(error)
	}
}
