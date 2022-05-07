const { Router } = require('express')
const {
	verifyToken,
	authRole,
	attriCollectionValidation,
	attributeValidation,
	validate,
} = require('../helper')
const attributeController = require('../controllers/attribute-controller')
const { ROLE } = require('../constants')

const router = Router()

// @route    GET api/attribute/all-collections
// @desc     Get all attribute collections
// @access   Private (Admin)
router.get(
	'/all-collections',
	verifyToken,
	authRole(ROLE.ADMIN),
	attributeController.getAttributeCollection
)

// @route    POST api/attribute/create-collection
// @desc     Create a attribute collection
// @access   Private (Admin)
router.post(
	'/create-collection',
	verifyToken,
	authRole(ROLE.ADMIN),
	attriCollectionValidation,
	validate,
	attributeController.createAttriCollection
)

// @route   PUT api/attribute/update-collection/:collectionId
// @desc    Update a attribute collection
// @access  Private (Admin)
router.put(
	'/update-collection/:collectionId',
	verifyToken,
	authRole(ROLE.ADMIN),
	attriCollectionValidation,
	validate,
	attributeController.updateAttributeCollection
)

// @route	PUT api/attribute/toggle-collection/:collectionId
// @desc	toggle attribute status
// @access	Private (Admin)
router.put(
	'/toggle-collection/:collectionId',
	verifyToken,
	authRole(ROLE.ADMIN),
	attributeController.toggleActiveCollection
)

// @route	DELETE api/attribute/:id
// @desc	Delete a attribute collection
// @access	Private (Admin)
router.delete(
	'/delete-collection/:collectionId',
	verifyToken,
	authRole(ROLE.ADMIN),
	attributeController.deleteAttributeCollection
)

// @route    POST api/attribute/add-attribute/:collectionId
// @desc     Add attributes to a attribute collection
// @access   Private (Admin)
router.post(
	'/add-attribute/:collectionId',
	verifyToken,
	authRole(ROLE.ADMIN),
	attributeValidation,
	validate,
	attributeController.addAttributes
)

// @route	PUT api/attribute/update-attribute/:attributeId
// @desc	Update a attribute
// @access	Private (Admin)
router.put(
	'/update-attribute/:collectionId/:attributeId',
	verifyToken,
	authRole(ROLE.ADMIN),
	attributeValidation,
	validate,
	attributeController.updateAttribute
)

// @route	PUT api/attribute/toggle-attribute/:collectionId/:attributeId
// @desc	toggle attribute status
// @access	Private (Admin)
router.put(
	'/toggle-attribute/:collectionId/:attributeId',
	verifyToken,
	authRole(ROLE.ADMIN),
	attributeController.toggleActiveAttribute
)

// @route	DELETE api/attribute/delete-attribute/:collectionId/:attributeId
// @desc	Delete a attribute
// @access	Private (Admin)
router.delete(
	'/delete-attribute/:collectionId/:attributeId',
	verifyToken,
	authRole(ROLE.ADMIN),
	attributeController.deleteAttribute
)

module.exports = router
