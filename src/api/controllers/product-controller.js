const { HttpError } = require('../error')
const { Product } = require('../models')
const { capitalize, convertToSlug } = require('../helper/utils')
const { removeLocalFile } = require('../helper/fs_')
const {
	compressImage,
	uploadToCloudinary,
	deleteFromCloudinary,
	cloudinaryUrlTransformer,
} = require('../../config/cloudinary_')

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

		const images = {}

		// req.files is an object containing all the files uploaded
		// and all keys(names of different image input fields)
		// of that object have array of files
		for (let key in req.files) {
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

			images[key] = image
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
			message: 'Product added successfully',
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
			'Something went wrong, could not add product',
			500
		)
		return next(error)
	}
}

exports.getProducts = async (req, res, next) => {
	try {
		const { paginatedResults } = res.locals

		paginatedResults.products = paginatedResults.docs
		delete paginatedResults.docs

		await Product.populate(paginatedResults.products, {
			path: 'category.topLevel category.secondLevel category.thirdLevel createdBy',
		})

		res.status(200).json({
			message: 'Products fetched successfully',
			...paginatedResults,
		})
	} catch (err) {
		console.log(err)
		const error = new HttpError(
			'Something went wrong, could not fetch products',
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
			'Something went wrong, could not fetch product',
			500
		)
		return next(error)
	}
}

exports.updateProductById = async (req, res, next) => {
	try {
		const { id } = req.params
		const foundProduct = await Product.findById(id)
		let {
			name,
			brand,
			description,
			price,
			mrp,
			stock,
			properties,
			imagesState,
		} = req.body

		properties = JSON.parse(properties)
		imagesState = JSON.parse(imagesState)

		if (!foundProduct) {
			const error = new HttpError('Product update failed!')
		}

		if (name) foundProduct.name = name
		if (brand) foundProduct.brand = brand
		if (description) foundProduct.description = description
		if (price) foundProduct.price = price
		if (mrp) foundProduct.mrp = mrp
		if (stock) foundProduct.stock = stock

		for (prop of properties) {
			for (prop_ of foundProduct.properties) {
				if (prop_.name === prop.name && prop_.value !== prop.value) {
					prop_.value = prop.value
				}
			}
		}

		for (let key in imagesState) {
			if (imagesState[key].change_detected && !req.files[key]) {
				await deleteFromCloudinary(foundProduct.images[key].cloudinaryId)
				foundProduct.images[key] = undefined
			}
		}

		for (let key in req.files) {
			if (foundProduct.images[key]?.cloudinaryId) {
				await deleteFromCloudinary(foundProduct.images[key].cloudinaryId)
			}
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

			foundProduct.images[key] = image
		}

		await foundProduct.save()

		res.status(200).json({
			message: 'Product updated successfully',
			product: foundProduct,
		})
	} catch (err) {
		console.log(err)
		const keys = Object.keys(req.files)
		keys.forEach(key => {
			req.files[key].forEach(file => {
				removeLocalFile(file.path)
			})
		})
		const error = new HttpError(
			'Something went wrong, could not update product',
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

		for (let key in product.images) {
			const cloudinaryId = product.images[key].cloudinaryId

			if (cloudinaryId) {
				await deleteFromCloudinary(cloudinaryId)
			}
		}

		await product.remove()

		res.status(200).json({
			message: 'Product removed successfully',
			productId: id,
		})
	} catch (err) {
		console.log(err)
		if (err.kind === 'ObjectId') {
			const error = new HttpError('Product not found', 404)
			return next(error)
		}
		const error = new HttpError(
			'Something went wrong, could not remove product',
			500
		)
		return next(error)
	}
}
