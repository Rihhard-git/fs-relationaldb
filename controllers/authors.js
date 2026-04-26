const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {

    const authors = await Blog.findAll({
        attributes: { 
            exclude: ['userId', 'title', 'url', 'id', 'likes'],
            include: [
                [sequelize.fn('COUNT', sequelize.col('*')), 'blogs'],
                [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
            ]
        },
        order: [['likes', 'DESC']],
        group: 'author'
    })

    res.json(authors)


})

module.exports = router