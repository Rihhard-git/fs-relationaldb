const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    if(!username || username.length < 3 || password.length < 3 || !password) {
        res.status(400).json({ error: 'Username or password not valid for registration, check username or password'})
    }

    const salt = 10
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User( {
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1})
    res.json(users)
})

module.exports = usersRouter