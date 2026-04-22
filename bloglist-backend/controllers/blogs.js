const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const body = req.body


  if(!req.token) {
    return res.status(401).json( { error: 'token invalid' })
  }

  if (!req.user) {
    return res.status(400).json({ error: 'userId missing or not valid'})
  }

  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,user: user._id
  })

  const savedBlog = await blog.save()

  console.log(savedBlog)

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (req, res) => {

  if(!req.token) {
    return res.status(401).json( { error: 'token invalid' })
  }

  const blog = await Blog.findById(req.params.id)


  if (!blog.user.toString() === req.user.id) {
    return res.status(400).json({ error: 'userId missing or not valid'})
  } else {
    await Blog.findByIdAndDelete(req.params.id)
    
    res.status(204).end()
  } 
})

blogsRouter.put('/:id', async (req, res) => {

  const { likes } = req.body

  const blogToUpdate = await Blog.findById(req.params.id)

  const updatedBlog = new Blog({
    id: blogToUpdate.id,
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: likes
  })
  const savedBlog = await updatedBlog.save()

  res.status(200).json(savedBlog)
  
})

module.exports = blogsRouter