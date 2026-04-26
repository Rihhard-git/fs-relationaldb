const { Op } = require('sequelize')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')

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

const blogFinder = async (req, res, next) => {   

    await Blog.findByPk(req.params.id)
        .then(blog => {
            req.blog = blog
            next()
        })
        .catch(error => next(error))
}

router.get('/', async (req, res) => {

    console.log('testing some testing ')

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
        const blog = await Blog.create({...req.body, userId: user.id})
        res.json(blog)
    } catch (error) {
        next(error)
        return res.status(400).json({ error })
        
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
            if (user.id === req.blog.userId) {
                await req.blog.destroy()
                return res.status(204).send({ success: 'delete was successfull'})
            } else {
                return res.status(400).send({ error: 'wrong credentials for delete'})
            }
    } catch (error){
        next(error)
        return res.status(400).json({ error })
    }  
})

module.exports = router