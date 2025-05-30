import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../user/user.model.js';

const app = express.Router();

/**
 * Ruta para el registro de usuarios.
 * Valida los datos de entrada, verifica si el correo ya existe, 
 * y crea un nuevo usuario con una contraseña encriptada.
 */
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verifica que los campos requeridos estén presentes
        if (!name || !email || !password) {
            return res.status(400).send('Faltan campos requeridos');
        }

        // Verifica si el correo electrónico ya está registrado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send('El correo electrónico ya existe');
        }

        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea el nuevo usuario en la base de datos
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Genera un token JWT para la autenticación
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '3h', algorithm: 'HS256' }
        );

        // Respuesta exitosa con el token y los datos del usuario
        res.status(201).send({ token, user: { ...newUser.dataValues }, message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * Ruta para iniciar sesión.
 * Verifica las credenciales proporcionadas y genera un token JWT 
 * si las credenciales son correctas.
 */
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca al usuario por correo electrónico
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send('Correo electrónico o contraseña incorrectos');
        }

        // Compara la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET no está definido en el entorno');
                return res.status(500).send('Error en la configuración del servidor');
            }
            // Genera un token JWT si la contraseña es correcta
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '3h',
            });

            // Respuesta exitosa con el token y los datos del usuario
            res.status(200).send({ token, user: { ...user.dataValues }, message: 'Inicio de sesión correcto' });
        } else {
            res.status(400).send('Correo electrónico o contraseña incorrectos');
        }

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default app;
