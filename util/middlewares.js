const errorHandler = (error, req, res, next) => {

    console.log(error.name)
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


module.exports = { errorHandler }