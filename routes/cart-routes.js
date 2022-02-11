const { Router } = require('express')
const cartController = require('../controllers/cart-controller')
const {
	verifyToken,
	isUser,
} = require('../helper')

const router = Router() 

// @route   POST api/cart/add
// @desc    Add product to cart
// @access  Private
router.post('/add', verifyToken, isUser, cartController.addToCart)

module.exports = router