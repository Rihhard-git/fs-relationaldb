const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'rainv', passwordHash })
    
    await user.save()

})


test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('all blogs are returned and have identification field named id (not_id)', async () => {
    const res = await api.get('/api/blogs')
    // test all blogs are returned
    assert.strictEqual(res.body.length, helper.initialBlogs.length)

    // test all blogs have "id"
    res.body.forEach(b => {
        assert.strictEqual(('id' in b), true)
    })

})
test('valid blog can be added to DB with valid token', async () => {

    const loggedUser = await api
        .post('/api/login')
        .send({username:'rainv', password:'salasana'})
        .expect(200)

    const newBlog = {
        title: "Testing is fun",
        author: "Testimaniac",
        url: "http://myblog.com/testing",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body.length, helper.initialBlogs.length + 1)

    
    assert(res.body.some(b => b.title === newBlog.title && b.author === newBlog.author && b.url === newBlog.url)) 

})
test('valid blog can not be added if not valid token', async () => {
    const newBlog = {
        title: "Testing is fun",
        author: "Testimaniac",
        url: "http://myblog.com/testing",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)


})
test('if newly added blog has no likes, value will be set 0', async () => {

    const loggedUser = await api
        .post('/api/login')
        .send({username:'rainv', password:'salasana'})
        .expect(200)

    const newBlog = {
        title: "Testing is fun",
        author: "Testimaniac",
        url: "http://myblog.com/testing",
    }

    const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlog)

    assert.strictEqual(savedBlog.body.likes, 0)

})

test('new blog without title or url gives error', async () => {

    const loggedUser = await api
        .post('/api/login')
        .send({username:'rainv', password:'salasana'})
        .expect(200)

    const newBlogWithoutTitle = {
        author: "Testman",
        url: "haveurlbutnotitle"
    }
    const newBlogWithoutUrl = {
        title: "Have title, but no url",
        author: "Testman"
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlogWithoutTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlogWithoutUrl)
        .expect(400)

})

test('a blog can be deleted', async () => {

    const loggedUser = await api
        .post('/api/login')
        .send({username:'rainv', password:'salasana'})
        .expect(200)

    const newBlog = {
        title: "Testing is fun",
        author: "Testimaniac",
        url: "http://myblog.com/testing",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length -1]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length -1)
})

test('a blog can be edited (add likes)', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    console.log(blogToUpdate)

    const editedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
        id: blogToUpdate.id,
    }

    console.log(editedBlog)


    const savedBlog = await api
        .put(`/api/blogs/${editedBlog.id}`)
        .send(editedBlog)
        .expect(200)
    

    assert.strictEqual(savedBlog.body.likes, editedBlog.likes) 

})
 
after(async () => {
    await mongoose.connection.close()
})