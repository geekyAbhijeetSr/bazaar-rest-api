const { Router } = require('express')
const cartController = require('../controllers/cart-controller')
const { verifyToken, authRole } = require('../helper')
const { ROLE } = require('../constants')

const router = Router()

// @route   POST api/cart/add
// @desc    Add product to cart
// @access  Private
router.post(
	'/add',
	verifyToken,
	authRole(ROLE.CUSTOMER),
	cartController.addToCart
)

module.exports = router
