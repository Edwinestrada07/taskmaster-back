import jwt from 'jsonwebtoken';

/**
 * Middleware para validar el token JWT en las solicitudes.
 * Si el token es válido, añade la información del usuario a `req.user` y llama a `next()`.
 * Si el token es inválido o no está presente, se devuelve un error con el estado correspondiente.
 */
function validateToken(req, res, next) {
    // Obtiene el token de la cabecera 'authorization'
    const token = req.headers['authorization'];

    // Si no se proporciona un token, retorna un error 405 (Método no permitido)
    if (!token) {
        return res.status(405).send('No autorizado');
    }

    try {
        // Verifica y decodifica el token usando la clave secreta almacenada en las variables de entorno
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Almacena la información del usuario en la solicitud para su uso posterior
        req.user = {
            id: decoded.id,
        };

        // Llama a la siguiente función en la cadena de middleware
        next();
    } catch (error) {
        // Manejo específico de errores según el tipo de error
        if (error.name === 'TokenExpiredError') {
            return res.status(405).send('Token expirado. Genere un nuevo token');
        } else {
            return res.status(405).send('Token no válido');
        }
    }
}

export default validateToken;

