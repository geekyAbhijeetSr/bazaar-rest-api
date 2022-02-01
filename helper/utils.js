exports.capitalize = str => {
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

exports.categoriesToTree = categoriesToTree
