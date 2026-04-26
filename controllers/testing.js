const { sequelize } = require('../util/db')
const { User, Blog } = require('../models')

const router = require('express').Router()

router.get('/', (req, res) => {
    res.send(200)
})

router.post('/api/reset', async (req, res) => {

    await sequelize.drop()
    await sequelize.sync({ force: true})
    res.status(204).send('ok')
})

module.exports = router