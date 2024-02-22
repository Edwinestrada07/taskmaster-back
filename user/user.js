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

// Ruta para cambiar la contraseña del usuario
app.put('/change-password', validateToken, async (req, res) => {
    // Obtener el ID de usuario del token JWT
    const userId = req.user.id;
  
    // Obtener la contraseña actual, la nueva contraseña y el ID del usuario del cuerpo de la solicitud
    const { currentPassword, newPassword } = req.body;
  
    try {
        // Verificar si la contraseña actual es válida
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const hashedPassword = user.rows[0].password;
        const passwordMatch = await bcrypt.compare(currentPassword, hashedPassword);
    
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }
    
        // Hashear la nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
        // Actualizar la contraseña en la base de datos
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);
    
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta para cargar una imagen de perfil
app.post('/upload-profile-image', validateToken, async (req, res) => {
    // Obtener el ID de usuario del token JWT
    const userId = req.user.id;
  
    // Obtener el archivo de imagen del cuerpo de la solicitud
    const profileImage = req.file;
  
    try {
      // Guardar la URL de la imagen de perfil en la base de datos o en algún sistema de almacenamiento
      // En este ejemplo, supongamos que guardamos la URL en la base de datos
      await pool.query('UPDATE users SET profile_image_url = $1 WHERE id = $2', [profileImage.path, userId]);
  
      res.status(200).json({ message: 'Imagen de perfil actualizada correctamente' });
    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});
  
export default app