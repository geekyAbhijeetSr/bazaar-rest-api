const { HttpError } = require('../error')
const { Product } = require('../models')
const {
	capitalize,
	compressImage,
	uploadToCloudinary,
	cloudinaryUrlTransformer,
	deleteFromCloudinary,
	removeLocalFile,
	convertToSlug,
} = require('../helper')

exports.createProduct = async (req, res, next) => {
	try {
		const { userId } = req.tokenPayload
		const {
			name,
			brand,
			description,
			topLevelCat,
			secondLevelCat,
			thirdLevelCat,
			properties,
			mrp,
			price,
			stock,
		} = req.body

		const slug = convertToSlug(name)
		const productExist = await Product.findOne({
			slug,
		})

		if (productExist) {
			const error = new HttpError('Product already exist', 422)
			return next(error)
		}

		const prop = JSON.parse(properties)
		const category = {}
		category.topLevel = topLevelCat
		category.secondLevel = secondLevelCat
		category.thirdLevel = thirdLevelCat

		const images = []
		const keys = Object.keys(req.files)

		for (let key of keys) {
			const imageFile = req.files[key][0]
			const compressedImgPath = await compressImage(imageFile.path)
			const result = await uploadToCloudinary(compressedImgPath, 'products')

			const url = result.secure_url
			const publicId = result.public_id

			const image = {
				original: cloudinaryUrlTransformer(url, 'product'),
				thumbnail: cloudinaryUrlTransformer(url, 'product_small'),
				cloudinaryId: publicId,
			}

			images.push(image)
		}

		const productObj = {
			name: capitalize(name),
			slug,
			brand,
			price,
			mrp,
			stock,
			description,
			images,
			category,
			properties: prop,
			createdBy: userId,
		}

		const product = await new Product(productObj)

		await product.save()

		await Product.populate(product, {
			path: 'category.topLevel category.secondLevel category.thirdLevel createdBy',
		})

		res.status(201).json({
			message: 'Product created successfully',
			product,
		})
	} catch (err) {
		const keys = Object.keys(req.files)
		keys.forEach(key => {
			req.files[key].forEach(file => {
				removeLocalFile(file.path)
			})
		})
		const error = new HttpError(
			'Something went wrong, could not create product.',
			500
		)
		return next(error)
	}
}

exports.getProducts = async (req, res, next) => {
	try {
		const { docs } = res.paginatedResults

		await Product.populate(docs, {
			path: 'category.topLevel category.secondLevel category.thirdLevel createdBy',
		})

		res.paginatedResults.docs = docs

		const products = res.paginatedResults

		res.status(200).json({
			message: 'Products fetched successfully',
			products,
		})
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not fetch products.',
			500
		)
		return next(error)
	}
}

exports.getProductById = async (req, res, next) => {
	try {
		const { id } = req.params
		const product = await Product.findById(id)
		if (!product) {
			const error = new HttpError('Product not found', 404)
			return next(error)
		}

		await Product.populate(product, {
			path: 'category.topLevel category.secondLevel category.thirdLevel createdBy',
		})

		res.status(200).json({
			message: 'Product fetched successfully',
			product,
		})
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not fetch product.',
			500
		)
		return next(error)
	}
}

exports.deleteProduct = async (req, res, next) => {
	try {
		const { id } = req.params
		const product = await Product.findById(id)
		if (!product) {
			const error = new HttpError('Product not found', 404)
			return next(error)
		}

		for (let image of product.images) {
			const result = await deleteFromCloudinary(image.cloudinaryId)
			if (result !== 'ok') {
				const error = new HttpError(
					'Something went wrong, could not delete product.',
					500
				)
				return next(error)
			}
		}

		await product.remove()

		res.status(200).json({
			message: 'Product deleted successfully',
		})
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete product.',
			500
		)
		return next(error)
	}
}
