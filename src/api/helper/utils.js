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
				image: c.image,
				parentId: c.parentId,
				attributeCollection: c.attributeCollection,
				children: categoriesToTree(categories, c._id),
			})
		}
	}

	return result
}

const randomColor = () => {
	return Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, '0')
}

const avatarPlaceholder = (sprites, seed) => {
	const color = randomColor()
	return `https://avatars.dicebear.com/api/${sprites}/${seed}.svg?background=%23${color}`
	// Replace :sprites with male, female, human, identicon, initials, bottts, avataaars, jdenticon, gridy or micah.
	// The value of:seed can be anything you like - but don't use any sensitive or personal data here!
}

const uid = type => {
	switch (type) {
		case 'nano':
			return Math.random().toString(36).substring(4, 8)
		case 'short':
			return new Date().getTime().toString(36)
		case 'long':
			return (
				Math.random().toString(36).substring(2, 10) +
				new Date().getTime().toString(36) +
				Math.random().toString(36).substring(2, 10)
			)
		default:
			return (
				new Date().getTime().toString(36) +
				Math.random().toString(36).substring(2, 10)
			)
	}
}

const convertToSlug = (str, unique = false) => {
	const cleanStr1 = str
		.toLowerCase()
		.replace(/['’]/g, '')
		.replace(/&/g, ' and ')
		.replace(/₹/g, ' rupee')
		.replace(/₨/g, ' rupee')
		.replace(/\$/g, ' dollar')
		.replace(/€/g, ' euro')
		.replace(/£/g, ' pound')
		.replace(/¥/g, ' yen')
		.replace(/₩/g, ' won ')
		.replace(/₦/g, ' naira')
		.replace(/₱/g, ' peso')
		.replace(/₫/g, ' dong')
		.replace(/₭/g, ' kip')
		.replace(/₮/g, ' tugrik')
		.replace(/₺/g, ' lira')
		.replace(/₴/g, ' hryvnia')
		.replace(/₣/g, ' franc')
		.replace(/[^A-Za-z0-9,]/g, ' ')
		.trim()

	const strArr = cleanStr1.split(',')
	let cleanStr2 = strArr[0]

	if (strArr.length > 1) {
		for (let i = 0; i < strArr.length - 1; i++) {
			let digRe = /\d/
			let str1 = strArr[i]
			let str2 = strArr[i + 1]
			let lastIndex = str1.length - 1

			if (digRe.test(str1[lastIndex]) && digRe.test(str2[0])) {
				cleanStr2 = cleanStr2 + str2
			} else {
				cleanStr2 = cleanStr2 + ' ' + str2
			}
		}
	}

	let slug = cleanStr2.replace(/\s+/g, '-')

	if (unique) {
		slug = slug + '-' + uid('nano')
	}

	return slug
}

module.exports = {
	capitalize,
	categoriesToTree,
	convertToSlug,
	uid,
	randomColor,
	avatarPlaceholder,
}
