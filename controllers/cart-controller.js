const { HttpError } = require('../error')
const { Cart, Product } = require('../models')

exports.addToCart = async (req, res, next) => {
	try {
		const { userId } = req.tokenPayload
		const { productId, quantity } = req.body

		const cart = await Cart.findOne({ user: userId })
		const product = await Product.findById(productId)

		if (!product) {
			const error = new HttpError('Product not found', 404)
			return next(error)
		}

		if (!cart) {
			const newCart = new Cart({
				user: userId,
				products: [{ product: productId, quantity }],
			})

			await newCart.save()

			res.json({
				message: 'Product added to cart',
				cart: newCart,
			})
		} else {
			const productExistInCart = cart.products.find(product => {
				return product.product.toString() === productId
			})

			if (productExistInCart) {
				productExistInCart.quantity += quantity
			} else {
				cart.products.push({ product: productId, quantity })
			}

			await cart.save()

			res.json({
				message: 'Product added to cart',
				cart,
			})
		}
	} catch (err) {
		const error = new HttpError('Failed to add product to cart', 500)
		return next(error)
	}
}
