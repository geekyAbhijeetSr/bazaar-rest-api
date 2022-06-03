const { HttpError } = require('../error')

exports.canDelete = (model, notFoundError, notAllowedError) => {
  return async (req, res, next) => {
    const { id } = req.params

    const doc = await model.findById(id)

    if (!doc) {
      throw new HttpError(notFoundError)
    }

    if (doc.userId !== req.user.id) {
      throw new HttpError(notAllowedError)
    }

    req.doc = doc

    next()
  };
}