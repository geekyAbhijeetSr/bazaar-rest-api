const { HttpError } = require('../error')
const { Product } = require('../models')
const {
	capitalize,
	compressImage,
	uploadToCloudinary,
	cloudinaryUrlTransformer,
	removeLocalFile,
	convertToSlug,
} = require('../helper')

exports.createProduct = async (req, res, next) => {
	try {
		const { userId } = req.tokenPayload
		const { name, price, mrp, stock, description, category, properties } =
			req.body

		const cat = JSON.parse(category)
		const prop = JSON.parse(properties)

		const images = []
		for (let file of req.files) {
			const compressedImgPath = await compressImage(file.path, 624, 624)
			const result = await uploadToCloudinary(compressedImgPath)

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
			slug: convertToSlug(name, true),
			price,
			mrp,
			stock,
			description,
			images,
			category: cat,
			properties: prop,
			createdBy: userId,
		}

		const product = new Product(productObj)

		res.status(201).json({
			message: 'Product created successfully',
			product,
		})
	} catch (err) {
		req.files.forEach(async file => {
			removeLocalFile(file.path)
		})
		const error = new HttpError(
			'Something went wrong, could not create product.',
			500
		)
		return next(error)
	}
}
