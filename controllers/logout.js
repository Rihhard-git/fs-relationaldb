const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.delete('/', async (req, res, next) => {


    const authorization = req.get('authorization')

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
        return res.status(401).send({ error: 'token missing'})
    }
    const token = authorization.substring(7)
    let decodedToken
    try {
        decodedToken = jwt.verify(token, SECRET)
    } catch {
        return res.status(401).json({ error: 'token invalid'})
    }
    

    const sessions = await Session.findAll({ where: { userId: decodedToken.id }})

    if (sessions === null) {
        return res.status(401).send({ error: 'sessions not found'})
    }

    const sessionTokens = sessions.map(s => s.token)

    if (!sessionTokens.includes(token)) {
        return res.status(401).send({ error: 'invalid token'})
    }


    await Session.destroy({ where: { userId: decodedToken.id }})
    return res.status(204).end()



    /* if (authorization && authorization.toLowerCase().startsWith('bearer ')) {

            const session = await Session.findAll({
                where: {
                    token: authorization.substring(7)
                }
            })
            if (session !== null) {
                await Session.destroy({
                    where: {
                        token: authorization.substring(7)
                    }
                })
                return res.status(204).end()
            } else {
                return res.status(401).send({ error: 'token invalid'})
            }
        } else {
            return res.status(401).send({ error: 'token missing'})
        } */
})

module.exports = router