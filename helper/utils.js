const fs = require('fs')

const removeLocalFile = async filePath => {
	try {
		fs.unlink(filePath, err => {
			if (err && err.code == 'ENOENT') {
				console.info("Error! File doesn't exist.")
			} else if (err) {
				console.error('Something went wrong. Please try again later.')
			} else {
				console.info(`Successfully removed file with the path of ${filePath}`)
			}
		})
	} catch (err) {
		console.log(err)
	}
}

const capitalize = str => {
	return str[0].toUpperCase() + str.slice(1)
}

const categoriesToTree = (categories, parentId = null) => {
	const result = []
	let category

	if (parentId === null) {
		category = categories.filter(c => c.parentId == undefined)
	} else {
		category = categories.filter(c => {
			if (c.parentId) {
				return c.parentId.toString() == parentId.toString()
			}
		})
	}

	if (category) {
		for (const c of category) {
			result.push({
				_id: c._id,
				name: c.name,
				slug: c.slug,
				parentId: c.parentId,
				children: categoriesToTree(categories, c._id),
			})
		}
	}

	return result
}

const getExt = fileName => {
	const re = /(?:\.([^.]+))?$/
	return re.exec(fileName)[1]
}

module.exports = {
	removeLocalFile,
	capitalize,
	categoriesToTree,
	getExt,
}
