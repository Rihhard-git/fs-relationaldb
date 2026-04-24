const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.scope('withoutPassword').findAll({
        include: {
            model: Blog,
            attributes: {
                exclude: ['userId']
            }
        }
    })
    res.json(users)
})
router.post('/', async (req, res, next) => {

    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    
    await User.create({ username, name, passwordHash }, {attributes: { exclude: ['passwordHash']}})
        .then(user => res.status(201).json(user))
        .catch(error => next(error)) 
})
router.put('/:username', async (req, res) => {

    if (!req.body.name) {
        res.status(400).send({ error: 'data is missing' })
    }
    const user = await User.scope('withoutPassword').findOne({ where: { username: req.params.username}})
    if (user) {
        console.log('found user to update')
        user.name = req.body.name
        await user.save()
        res.json(user)
    } else {
        console.log('didnt find user with parameters')
        return res.status(404).end()
    }
})

router.get('/:id', async (req ,res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})
module.exports = router