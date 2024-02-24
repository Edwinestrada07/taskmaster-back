import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';

const app = express.Router();

// Ruta para el registro de usuarios
app.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (existingUser) {
            return res.status(400).send('El correo electrónico ya existe');
        }

        // Creación de un nuevo usuario
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Aquí debes almacenar la contraseña como hash en la base de datos en lugar de texto plano
        });
        const token = jwt.sign({ id: newUser.id }, '3de113c0-757c-45be-a5ab-238221699cd2', {
            expiresIn: '1h',
        });

        res.status(201).send({ token, user: { ...newUser.dataValues }, message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error('Error al registrar usuario', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(400).send('Correo electrónico o contraseña incorrectos');
        }

        // Verificar la contraseña - Aquí deberías comparar los hashes de las contraseñas en lugar de las contraseñas directamente
        if (user.password === req.body.password) { // Aquí debes usar una función de comparación de hashes, como bcrypt.compare
            const token = jwt.sign({ id: user.id }, '3de113c0-757c-45be-a5ab-238221699cd2', {
                expiresIn: '1h',
            });
            res.status(200).send({ token, user: { ...user.dataValues }, message: 'Inicio de sesión correcto' });
        } else {
            res.status(400).send('Correo electrónico o contraseña incorrectos');
        }

    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default app;
