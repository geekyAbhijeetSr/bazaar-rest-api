const { Router } = require('express')
const cartController = require('../controllers/cart-controller')
const {
	authentication: { verifyToken, authRole },
} = require('../middleware')
const {
	constants: { ROLE },
} = require('../../config')

const router = Router()

// @route   POST api/cart/add
// @desc    Add product to cart
// @access  Private
router.post(
	'/add',
	verifyToken,
	authRole([ROLE.CUSTOMER]),
	cartController.addToCart
)

module.exports = router
