const {
	signupValidation,
	loginValidation,
	categoryValidation,
	productValidation,
	validate,
} = require('./validation')

const { verifyToken, isAdmin, isUser } = require('./authentication')

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
} = require('./utils')

const {
	multerUploadFile,
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
	validate,

	// from authentication.js
	verifyToken,
	isAdmin,
	isUser,

	// from multer-config.js
	multerUploadFile,
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
}
