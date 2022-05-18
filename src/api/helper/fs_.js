const fs = require('fs')
const path = require('path')

const removeLocalFile = async filePath => {
	try {
		fs.unlink(filePath, err => {
			if (err && err.code == 'ENOENT') {
				console.log("Error! File doesn't exist.")
			} else if (err) {
				console.log('Something went wrong.')
			} else {
				console.log(`Successfully removed file with the path of ${filePath}`)
			}
		})
	} catch (err) {
		console.error(err)
	}
}

const removeOldFiles = (dir, milliseconds = 86400000, recursive = false) => {
	// 86400000 ms == 24 hours
	if (!fs.existsSync(dir)) return

	const files_n_dirs_array = fs.readdirSync(dir)

	files_n_dirs_array.forEach(file_or_dir => {
		const path_ = path.join(dir, file_or_dir)
		const stats = fs.statSync(path_)

		const now = new Date()
		const time = milliseconds

		if (stats.isFile() && now - stats.mtime >= time) {
			removeLocalFile(path_)
		} else if (stats.isDirectory() && recursive) {
			removeOldFiles(path_, milliseconds, recursive)
		}
	})
}

const getExt = fileName => {
	const re = /(?:\.([^.]+))?$/
	return re.exec(fileName)[1]
}

module.exports = {
	removeLocalFile,
	removeOldFiles,
	getExt,
}
