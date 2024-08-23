import Express from 'express';
import bcrypt from 'bcryptjs';
import User from './user.model.js';
import validateToken from '../authMiddleware/authMiddleware.js';

const app = Express.Router();

// Obtener perfil del usuario autenticado
app.get('/user/profile', validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener la información del usuario' });
    }
});

// Crear un nuevo usuario
app.post('/user', validateToken, async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...rest, password: hashedPassword });
        res.status(201).json({ status: 'success', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al crear el usuario' });
    }
});

// Actualizar perfil del usuario autenticado
app.put('/user/profile', validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [updatedCount] = await User.update(req.body, { where: { id: userId } });
        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al actualizar la información del usuario' });
    }
});

// Eliminar un usuario
app.delete('/user/:id', validateToken, async (req, res) => {
    try {
        const deletedCount = await User.destroy({
            where: { id: req.params.id },
            individualHooks: true
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al eliminar el usuario' });
    }
});

// Cambiar contraseña del usuario autenticado
app.put('/user/change-password', validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { password, newPassword } = req.body;

        // Buscar al usuario en la base de datos
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña actual
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ status: 'success' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al cambiar la contraseña' });
    }
});

export default app;
