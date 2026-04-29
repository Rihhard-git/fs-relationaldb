const { sequelize } = require('../util/db')
const { User, Blog, Session, ReadingList } = require('../models')

const router = require('express').Router()

router.get('/', (req, res) => {
    res.send(200)
})

router.post('/api/reset', async (req, res) => {

    await Session.destroy({ truncate: { cascade: true}})
    await ReadingList.destroy({ truncate: { cascade: true}})
    await Blog.destroy({ truncate: { cascade: true}})
    await User.destroy({ truncate: { cascade: true}})

    res.status(204).send('ok')
})

module.exports = router