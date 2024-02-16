import Express from 'express'
import User from './user.model.js'
import Op from 'sequelize'
import validateToken from '../authMiddleware/authMiddleware.js'

const app = Express.Router()

app.get('/user', validateToken, async (req, res) => {
    try {
        const { name } = req.query

        const conditions = {}
        conditions.status = 'ACTIVE'

        if(name) {
            conditions.name = { [Op.iLike]: `%${name}%` }
        }

        const user = await User.findAll({
            where : conditions
        })
        res.send(user)

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error '})
    }
})

app.get('/user/:id', validateToken, async (req, res) => {
    const user = await User.findOne({
        where: {
            status: 'ACTIVE',
            id: req.params.id
        }
    })

    if(!user) {
        return res.status(200).json({
            msg: `El usuario con el siguiente id ${ req.params.id }, no existe`
        })
    }
    res.send(user)
})

app.post('/user', validateToken, async (req, res) => {
    const user = await User.create(req.body)
    user.save()

    res.send({ status: 'success', user})
})

app.put('/user/:id', validateToken, async (req, res) => {
    const user = await User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    res.send({ status: 'success', user})
})

app.delete('/user/:id', validateToken, async (req, res) => {
    await User.destroy({
        where: {
            id: req.params.id
        },
        individualHooks: true
    })
    res.send({ status: 'success' })
})

export default app