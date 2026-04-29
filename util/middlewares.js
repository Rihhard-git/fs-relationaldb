const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, req, res, next) => {

    console.log(error)
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ error: error.message })
    }
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).send({ error: error.message })
    }
    if (error.name === 'TypeError') {
        return res.status(400).send({ error: error.message})
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).send({ error: error.message})
    }
    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'token invalid'})
        }
    } else {
        return res.status(401).json({ error: 'token missing'})
    }
    next()
}


module.exports = { errorHandler, tokenExtractor }