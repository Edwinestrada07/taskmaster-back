import Express from 'express'
import User from './user.model.js'
import validateToken from '../authMiddleware/authMiddleware.js'

const app = Express.Router()

app.get('/user/profile', validateToken, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findOne({ where: { id: userId } })
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.json(user) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' })
    }
})

/*app.get('/user/:id', validateToken, async (req, res) => {
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
})*/

app.post('/user', validateToken, async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ status: 'success', user: newUser })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al crear el usuario' })
    }
})

app.put('/user/profile', validateToken, async (req, res) => {
    try {
        const userId = req.user.id
        const [updatedCount] = await User.update(req.body, { where: { id: userId } })
        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.json({ status: 'success' })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al actualizar la información del usuario' })
    }
})

app.delete('/user/:id', validateToken, async (req, res) => {
    try {
        const deletedCount = await User.destroy({
            where: { id: req.params.id },
            individualHooks: true
        })

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.json({ status: 'success' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al eliminar el usuario' })
    }
})

// Ruta para cambiar la contraseña del usuario
app.put('/user/change-password', validateToken, async (req, res) => {
    try {
        const userId = req.user.id
        const { password, newPassword } = req.body
        const user = await User.findByPk(userId)

        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        if (password !== user.password) {
          return res.status(400).json({ message: 'La contraseña actual es incorrecta' })
        }

        user.password = newPassword
        await user.save()

        res.json({ status: 'success' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al cambiar la contraseña' })
    }
})
 
export default app