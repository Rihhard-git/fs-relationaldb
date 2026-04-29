const { Op } = require('sequelize')
const router = require('express').Router()
const { Blog, User, Session } = require('../models')
const { sequelize } = require('../util/db')
const { tokenExtractor } = require('../util/middlewares')



const blogFinder = async (req, res, next) => {   

    await Blog.findByPk(req.params.id)
        .then(blog => {
            req.blog = blog
            next()
        })
        .catch(error => next(error))
}

router.get('/', async (req, res) => {

    let where = {}

    if (req.query.search) {

        where = {
            [Op.or] : [
                { title: { [Op.iLike]: `%${req.query.search}%`}},
                { author: { [Op.iLike]: `%${req.query.search}%`}}            
            ]
        }    
    }

    const blogs = await Blog.findAll({
        order: [['likes', 'DESC']],
        attributes: { exclude: ['userId']},
        include: {
            model: User,
            attributes: ['name']
        },
        where
    })
    res.json(blogs)
})
router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

router.post('/', tokenExtractor, async (req, res, next) => {

    try {
        const user = await User.scope('withoutPassword').findByPk(req.decodedToken.id)
        const session = await Session.findOne({ where: {userId: req.decodedToken.id}})

        if (user && session !== null && session.userId === user.id) {
            const blog = await Blog.create({...req.body, userId: user.id})
            res.json(blog) 
        
        } else {
            return res.status(401).json({ error: 'unauthorized credentials for adding blog' })
        }

    } catch (error) {
        next(error)
        return res.status(401).json({ error })
        
    }

    /* await Blog.create(req.body)
        .then(blog => res.json(blog))
        .catch(error => next(error)) */
})
router.put('/:id', blogFinder, async (req, res, next) => {

    if (!req.body.likes) {
        res.status(400).send({ error: 'data is missing' })
    }

    req.blog.likes = req.body.likes
    await req.blog.save()
        .then(blog => res.json(blog))
        .catch(error => next(error))
/*   res.json(req.blog) */
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {

    try {
        const user = await User.scope('withoutPassword').findByPk(req.decodedToken.id)
        const session = await Session.findOne({ where: {userId: req.decodedToken.id}})
            if (user.id === req.blog.userId && session !== null && session.userId === user.id) {
                await req.blog.destroy()
                return res.status(204).send({ success: 'delete was successfull'})
            } else {
                return res.status(401).send({ error: 'unauthorized credentials for delete'})
            }
    } catch (error){
        next(error)
        return res.status(401).json({ error })
    }  
})

module.exports = router