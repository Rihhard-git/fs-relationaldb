const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog, ReadingList } = require('../models')
const { Op } = require('sequelize')

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

    let read = { [Op.in]: [true, false]}

    if (req.query.read) {
        read = req.query.read === "true"
    }


    const user = await User.scope('withoutPassword').findByPk(req.params.id, {




        attributes: { exclude: ['createdAt', 'updatedAt']},
        include: [
            {
                model: Blog,
                as: 'readings',
                attributes: { exclude: ['userId','createdAt', 'updatedAt']},
                through: {
                    attributes: ['id', 'read'],
                    where: {
                        read
                    }
                }
            }
        ]
    })
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})
module.exports = router