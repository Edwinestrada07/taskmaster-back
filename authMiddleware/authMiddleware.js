import jwt from 'jsonwebtoken';

function validateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(405).send('No autorizado');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(405).send('Token expirado. Genere un nuevo token');
        } else {
            return res.status(405).send('Token no válido');
        }
    }
}

export default validateToken;
