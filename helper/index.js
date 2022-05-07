const {
	signupValidation,
	loginValidation,
	categoryValidation,
	productValidation,
	attriCollectionValidation,
	attributeValidation,
	validate,
} = require('./validation')

const { verifyToken, authRole } = require('./authentication')

const {
	removeLocalFile,
	capitalize,
	categoriesToTree,
	getExt,
	convertToSlug,
	uid,
	randomColor,
	avatarPlaceholder,
	removeOldFiles,
	paginatedResponse,
} = require('./utils')

const {
	multerUploadFile,
	multerUploadMultiFile,
	multerUploadFiles,
	multerValidate,
} = require('./multer-config')

const {
	uploadToCloudinary,
	deleteFromCloudinary,
	compressImage,
	cloudinaryUrlTransformer,
} = require('./cloudinary-config')

module.exports = {
	start: require('./start'),

	// from validation.js
	signupValidation,
	loginValidation,
	categoryValidation,
	productValidation,
	attriCollectionValidation,
	attributeValidation,
	validate,

	// from authentication.js
	verifyToken,
	authRole,

	// from multer-config.js
	multerUploadFile,
	multerUploadMultiFile,
	multerUploadFiles,
	multerValidate,

	// from cloudinary-config.js
	uploadToCloudinary,
	deleteFromCloudinary,
	compressImage,
	cloudinaryUrlTransformer,

	// from utils.js
	removeLocalFile,
	capitalize,
	categoriesToTree,
	getExt,
	convertToSlug,
	uid,
	randomColor,
	avatarPlaceholder,
	removeOldFiles,
	paginatedResponse,
}
