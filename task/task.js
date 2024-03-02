import Express from 'express'
import Task from './task.model.js'
import Sequelize from 'sequelize'
import validateToken from '../authMiddleware/authMiddleware.js'

const app = Express.Router()

app.get('/task', validateToken, async (req, res) => {
    const {status} = req.query
    try {
        if(status){
            const tasksByStatus = await Task.findAll({
                where: {
                    status: {
                        [Sequelize.Op.eq]: `${status}`,
                    }
                }
            })
            return res.json(tasksByStatus)
        }else{
            const task = await Task.findAll()
            return res.json(task)
        }
                
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.post('/task', validateToken, async (req, res) => {
    const task = await Task.create(req.body)
    task.save()

    res.send({ status: "success", task })
})

app.put('/task/:id', validateToken, async (req, res) => {
    const task = await Task.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    res.send({ status: "success", task })
})

app.delete('/task/:id', validateToken, async (req, res) => {
    const task = await Task.destroy({
        where: {
            id: req.params.id
        },
        individual: true
    })
    res.send({ status: "success", task })
})

export default app;