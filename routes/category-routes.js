const { Router } = require('express')
const { verifyToken, isAdmin } = require('../helper')

const router = Router()

// @route    POST api/category/create
// @desc     Create a category
// @access   Private
router.post('/create', verifyToken, isAdmin, (req, res, next) => {
	res.json({
		message: 'Create a category',
		tokenPayload: req.tokenPayload,
	})
})

module.exports = router
