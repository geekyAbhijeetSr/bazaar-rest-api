const { HttpError } = require('../error')
const { Category } = require('../models')
const {
	categoriesToTree,
	convertToSlug,
	compressImage,
	uploadToCloudinary,
	deleteFromCloudinary,
	cloudinaryUrlTransformer,
	removeLocalFile,
} = require('../helper')

exports.createCategory = async (req, res, next) => {
	try {
		const { name, active, attributeCollection } = req.body

		const categoryObj = {
			name,
			active,
		}

		if (attributeCollection) {
			categoryObj.attributeCollection = attributeCollection
		}

		if (req.body.parentId) {
			const parentCategory = await Category.findById(req.body.parentId)
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

		if (req.file) {
			const compressedImgPath = await compressImage(req.file.path, 400, 400)
			const result = await uploadToCloudinary(compressedImgPath)
			const url = result.secure_url
			const publicId = result.public_id

			categoryObj.image = {
				url: cloudinaryUrlTransformer(url, 'q_medium'),
				cloudinaryId: publicId,
			}
		}

		const category = new Category(categoryObj)

		await category.save()

		res.status(201).json({
			message: 'Category created successfully',
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
		const { name, active, attributeCollection } = req.body
		const foundCat = await Category.findById(req.params.catId)

		const categoryObj = {
			name,
			active,
			slug: convertToSlug(name, true),
		}

		if (attributeCollection) {
			categoryObj.attributeCollection = attributeCollection
		}

		if (req.file) {
			const result_ = await deleteFromCloudinary(foundCat.image.cloudinaryId)
			if (result_ !== 'ok') {
				const error = new HttpError('Updating category failed', 500)
				return next(error)
			}
			const compressedImgPath = await compressImage(req.file.path, 400, 400)
			const result = await uploadToCloudinary(compressedImgPath)
			const url = result.secure_url
			const publicId = result.public_id

			categoryObj.image = {
				url: cloudinaryUrlTransformer(url, 'q_medium'),
				cloudinaryId: publicId,
			}
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
			message: 'Category updated successfully',
			category,
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

		await Category.findByIdAndDelete(req.params.catId)

		if (category.image.cloudinaryId) {
			const result = await deleteFromCloudinary(category.image.cloudinaryId)
			if (result !== 'ok') {
				const error = new HttpError('Deleting category failed', 500)
				return next(error)
			}
		}

		res.status(200).json({
			message: 'Category deleted successfully',
			categoryId: req.params.catId,
		})
	} catch (err) {
		const error = new HttpError('Deleting category failed', 500)
		return next(error)
	}
}
