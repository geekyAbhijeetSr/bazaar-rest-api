const { Router } = require('express')
const {
	verifyToken,
	isAdmin,
	attriCollNameValidation,
	attriCollNameValidation2,
	attributeValidation,
	attributeValidation2,
	attributeDeleteValidation,
	validate,
} = require('../helper')
const attributeController = require('../controllers/attribute-controller')

const router = Router()

// @route    POST api/attribute/create-collection
// @desc     Create a attribute collection
// @access   Private (Admin)
router.post(
	'/create-collection',
	verifyToken,
	isAdmin,
	attriCollNameValidation,
	validate,
	attributeController.createAttriCollection
)

// @route    PUT api/attribute/add-attribute
// @desc     Add attributes to a attribute collection
// @access   Private (Admin)
router.put(
	'/add-attribute',
	verifyToken,
	isAdmin,
	attributeValidation,
	validate,
	attributeController.addAttributes
)

// @route    GET api/attribute/all-collections
// @desc     Get all attribute collections
// @access   Private (Admin)
router.get(
	'/all-collections',
	verifyToken,
	isAdmin,
	attributeController.getAttributeCollection
)

// @route   PUT api/attribute/update-collection
// @desc    Update a attribute collection
// @access  Private (Admin)
router.put(
	'/update-collection',
	verifyToken,
	isAdmin,
	attriCollNameValidation2,
	validate,
	attributeController.updateAttributeCollection
)

// @route	PUT api/attribute/update-attribute
// @desc	Update a attribute
// @access	Private (Admin)
router.put(
	'/update-attribute',
	verifyToken,
	isAdmin,
	attributeValidation2,
	validate,
	attributeController.updateAttribute
)

// @route	PUT api/attribute/toggle-collection/:collectionId
// @desc	toggle attribute status
// @access	Private (Admin)
router.put(
	'/toggle-collection/:collectionId',
	verifyToken,
	isAdmin,
	attributeController.toggleActiveCollection
)

// @route	PUT api/attribute/toggle-attribute/:collectionId/:attributeId
// @desc	toggle attribute status
// @access	Private (Admin)
router.put(
	'/toggle-attribute/:collectionId/:attributeId',
	verifyToken,
	isAdmin,
	attributeController.toggleActiveAttribute
)

// @route	DELETE api/attribute/delete-attribute
// @desc	Delete a attribute
// @access	Private (Admin)
router.delete(
	'/delete-attribute',
	verifyToken,
	isAdmin,
	attributeDeleteValidation,
	validate,
	attributeController.deleteAttribute
)

// @route	DELETE api/attribute/:id
// @desc	Delete a attribute collection
// @access	Private (Admin)
router.delete(
	'/:id',
	verifyToken,
	isAdmin,
	attributeController.deleteAttributeCollection
)

module.exports = router
