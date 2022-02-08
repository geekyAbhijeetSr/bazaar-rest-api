const cloudinary = require('cloudinary').v2
const sharp = require('sharp')
const { removeLocalFile, uid } = require('./utils')

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.uploadToCloudinary = async localFilePath => {
	try {
		const result = await cloudinary.uploader.upload(localFilePath)
		await removeLocalFile(localFilePath)
		return result
	} catch (err) {
		await removeLocalFile(localFilePath)
		console.log(err)
	}
}

exports.deleteFromCloudinary = async publicId => {
	try {
		await cloudinary.uploader.destroy(publicId)
	} catch (err) {
		console.log(err)
	}
}

exports.compressImage = async (localFilePath, width, height, quality = 80) => {
	try {
		const newPath = `uploads/compressed/${uid()}.webp`

		await sharp(localFilePath, { animated: true })
			.toFormat('webp')
			.webp({ quality })
			.resize(width, height)
			.toFile(newPath)

		await removeLocalFile(localFilePath)

		return newPath
	} catch (err) {
		console.log(err)
	}
}

exports.cloudinaryUrlTransformer = (url, type) => {
	const index = url.indexOf('upload/') + 7
	const urlSlice1 = url.slice(0, index)
	const urlSlice2 = url.slice(index)

	let params
	switch (type) {
		case 'avatar':
			params = 'c_fill,g_face,h_400,w_400,q_auto:good/'
			break
		case 'avatar_face':
			params = 'c_crop,g_face,h_200,w_200,q_auto:low/'
			break
		case 'avatar_small':
			params = 'c_fill,g_face,h_200,w_200,q_auto:low/'
			break
		case 'product':
			params = 'c_fill,h_624,w_624,q_auto:good/'
			break
		case 'product_medium':
			params = 'c_fill,h_400,w_400,q_auto:good/'
			break
		case 'product_small':
			params = 'c_fill,h_200,w_200,q_auto:low/'
			break
		case 'q_good':
			params = 'q_auto:good/'
			break
		case 'q_medium':
			params = 'q_60/'
			break
		case 'q_low':
			params = 'q_auto:low/'
			break
		default:
			params = ''
	}

	return urlSlice1 + params + urlSlice2
}
