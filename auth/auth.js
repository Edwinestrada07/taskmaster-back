import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../user/user.model.js';

const app = express.Router();

// Ruta para el registro de usuarios
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send('Faltan campos requeridos');
        }

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).send('El correo electrónico ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
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

        // Comparar la contraseña proporcionada con el hash almacenado
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
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
