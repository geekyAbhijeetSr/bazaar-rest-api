const e = require('express')
const { HttpError } = require('../error')
const { AttributeCollection } = require('../models')

exports.createAttriCollection = async (req, res, next) => {
	try {
		const { name, active } = req.body

		const existCollection = await AttributeCollection.findOne({
			name: name,
		})

		if (existCollection) {
			const error = new HttpError('Attribute collection already exist', 422)
			return next(error)
		}

		const collection = new AttributeCollection({
			name,
			active,
		})

		await collection.save()

		res.status(201).json({
			message: 'Attribute collection created successfully',
			attributeCollection: collection,
		})
	} catch (err) {
		const error = new HttpError('Creating attribute collection failed', 500)
		next(error)
	}
}

exports.addAttributes = async (req, res, next) => {
	try {
		const allowedType = ['text', 'text-array']
		const { collectionId, name, type, placeholder, active } = req.body

		if (!allowedType.includes(type)) {
			const error = new HttpError('Invalid attribute input type', 422)
			return next(error)
		}

		const existCollection = await AttributeCollection.findById(collectionId)

		if (!existCollection) {
			const error = new HttpError('Attribute collection not found', 422)
			return next(error)
		}

		for (let i = 0; i < existCollection.attributes.length; i++) {
			if (existCollection.attributes[i].name === name) {
				const error = new HttpError('Attribute already exist', 422)
				return next(error)
			}
		}

		existCollection.attributes.push({
			name,
			type,
			placeholder,
			active,
		})

		await existCollection.save()

		res.status(200).json({
			message: 'Attribute added successfully',
			attributeCollection: existCollection,
		})
	} catch (err) {
		const error = new HttpError('Adding attribute failed', 500)
		next(error)
	}
}

exports.getAttributeCollection = async (req, res, next) => {
    try {
        const attributeCollection = await AttributeCollection.find()

        res.status(200).json({
            message: 'Attributes fetched successfully',
            attributeCollection,
        })
    } catch (err) {
        const error = new HttpError('Fetching attributes failed', 500)
        next(error)
    }
}

exports.updateAttributeCollection = async (req, res, next) => {
	try {
		const { id, name, active } = req.body

		const existCollection = await AttributeCollection.findById(id)

		if (!existCollection) {
			const error = new HttpError('Attribute collection not found', 422)
			return next(error)
		}

		existCollection.name = name
		existCollection.active = active

		await existCollection.save()

		res.status(200).json({
			message: 'Attribute collection updated successfully',
			attributeCollection: existCollection,
		})
	} catch (err) {
		const error = new HttpError('Updating attribute collection failed', 500)
		next(error)
	}
}

exports.updateAttribute = async (req, res, next) => {
	try {
		const { collectionId, attributeId, name, type, placeholder, active } = req.body

		const existCollection = await AttributeCollection.findById(collectionId)

		if (!existCollection) {
			const error = new HttpError('Attribute collection not found', 422)
			return next(error)
		}

		const attribute = existCollection.attributes.find(
			(attribute) => attribute._id.toString() === attributeId
		)

		if (!attribute) {
			const error = new HttpError('Attribute not found', 422)
			return next(error)
		}

		attribute.name = name
		attribute.type = type
		attribute.placeholder = placeholder
		attribute.active = active

		await existCollection.save()

		res.status(200).json({
			message: 'Attribute updated successfully',
			attributeCollection: existCollection,
		})
	} catch (err) {
		const error = new HttpError('Updating attribute failed', 500)
		next(error)
	}
}

exports.deleteAttributeCollection = async (req, res, next) => {
    try {
		const { id } = req.params

        const existCollection = await AttributeCollection.findById(id)

        if (!existCollection) {
            const error = new HttpError('Attribute collection not found', 422)
            return next(error)
        }

        await existCollection.remove()

        res.status(200).json({
            message: 'Attribute collection deleted successfully',
            id,
        })
	} catch (err) {
        const error = new HttpError('Removing attribute collection failed', 500)
        next(error)
    }
}

exports.deleteAttribute = async (req, res, next) => {
    try {
        const { collectionId, attributeId } = req.body

        const existCollection = await AttributeCollection.findById(collectionId)

        if (!existCollection) {
            const error = new HttpError('Attribute collection not found', 422)
            return next(error)
		}
		
		const attrIndex = existCollection.attributes.findIndex(
			(attribute) => attribute._id.toString() === attributeId
		)

        if (attrIndex === -1) {
            const error = new HttpError('Attribute not found', 422)
            return next(error)
        }

        existCollection.attributes.splice(attrIndex, 1)

        await existCollection.save()

        res.status(200).json({
            message: 'Attribute deleted successfully',
            attributeCollection: existCollection,
        })
    } catch (err) {
        const error = new HttpError('Removing attribute failed', 500)
        next(error)
    }
}

exports.toggleActiveCollection = async (req, res, next) => {
	try {
		const collection = await AttributeCollection.findById(req.params.collectionId)

		if (!collection) {
			const error = new HttpError('Attribute collection not found', 422)
			return next(error)
		}

		collection.active = !collection.active

		await collection.save()

		res.status(200).json({
			message: 'Attribute collection toggled successfully',
			attributeCollection: collection,
		})
	} catch (err) {
		const error = new HttpError('Toggling attribute collection failed', 500)
		next(error)
	}
}

exports.toggleActiveAttribute = async (req, res, next) => {
	try {
		const { collectionId, attributeId } = req.params

		const existCollection = await AttributeCollection.findById(collectionId)

		if (!existCollection) {
			const error = new HttpError('Attribute collection not found', 422)
			return next(error)
		}

		const attrIndex = existCollection.attributes.findIndex(
			(attr) => attr._id.toString() === attributeId
		)

		if (attrIndex === -1) {
			const error = new HttpError('Attribute not found', 422)
			return next(error)
		}

		existCollection.attributes[attrIndex].active = !existCollection.attributes[attrIndex].active

		await existCollection.save()

		res.status(200).json({
			message: 'Attribute toggled successfully',
			attributeCollection: existCollection,
		})
	} catch (err) {
		const error = new HttpError('Toggling attribute failed', 500)
		next(error)
	}
}

