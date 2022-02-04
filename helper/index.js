const {
	signupValidation,
	loginValidation,
	categoryValidation,
	validate,
} = require('./validation')

const { verifyToken, isAdmin, isUser } = require('./authentication')

const { removeLocalFile, capitalize, categoriesToTree, getExt } = require('./utils')

const { multerUploadFile } = require('./multer-config')

const { uploadToCloudinary, deleteFromCloudinary, compressImage, cloudinaryUrlTransformer } = require('./cloudinary-config')

module.exports = {
	start: require('./start'),

	// from validation.js
	signupValidation,
	loginValidation,
	categoryValidation,
	validate,

	// from authentication.js
	verifyToken,
	isAdmin,
	isUser,

	// from utils.js
	removeLocalFile,
	capitalize,
	categoriesToTree,
	getExt,

	// from multer-config.js
	multerUploadFile,

	// from cloudinary-config.js
	uploadToCloudinary,
	deleteFromCloudinary,
	compressImage,
	cloudinaryUrlTransformer,
}
