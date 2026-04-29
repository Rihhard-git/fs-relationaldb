const router = require('express').Router()
const { tokenExtractor } = require('../util/middlewares')
const { ReadingList, User, Blog, Session } = require('../models')
const { where } = require('sequelize')

router.post('/', async (req, res, next) => {

    if (!req.body.blogId || !req.body.userId ) {
        return res.status(400).send({ error: `id's missing`})
    }
    const user = await User.findByPk(req.body.userId)
    const blog = await Blog.findByPk(req.body.blogId)
    if (user === null || blog === null) {
        return res.status(404).send({ error: 'blog or user doesnt exist'})
    }
    const readingList = await ReadingList.findOne({where: {userId: user.id, blogId: blog.id}})
    if (readingList !== null) {
        return res.status(400).send({ error: 'blog already added on reading list'})
    } 
    const reading = await ReadingList.create({userId: user.id, blogId: blog.id})
    return res.json(reading)
   
})
router.put('/:id', tokenExtractor, async (req, res, next) => {

    const readingList = await ReadingList.findByPk(req.params.id)
    const session = await Session.findOne({ where: { userId: req.decodedToken.id }})

    if (session === null) {
        return res.status(401).send({ error: 'session has ended'})
    }

    if (readingList === null) {
        return res.status(404).send({ error: 'list not found!'})
    }
    if (readingList.userId !== req.decodedToken.id) {
        return res.status(401).send({ error: 'unauthrorized to change status'})
    }

    console.log('NOW WERE CHANGIN IT!!!')
    readingList.read = req.body.read
    await readingList.save()
    res.send(readingList)
})

module.exports = router