const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {   

    await Blog.findByPk(req.params.id)
        .then(blog => {
            req.blog = blog
            next()
        })
        .catch(error => next(error))

    /* req.blog = await Blog.findByPk(req.params.id)
       
        if (!req.blog) {
            res.status(404).end()
        } 
    next() */
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})
router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

router.post('/', async (req, res, next) => {

    await Blog.create(req.body)
        .then(blog => res.json(blog))
        .catch(error => next(error))



/*     try {
       const blog = await Blog.create(req.body)
        res.json(blog) 
    } catch (error) {
        return res.status(400).json({ error })
    } */
    
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

router.delete('/:id', blogFinder, async (req, res) => {
    await req.blog.destroy()
    res.status(204).end()
})

module.exports = router