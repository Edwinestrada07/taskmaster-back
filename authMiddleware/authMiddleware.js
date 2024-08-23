import jwt from 'jsonwebtoken'

function validateToken(req, res, next) {
    const token = req.headers[ 'authorization' ]

    if(!token) {
        res.status(405).send('not auth')
        return
    }
    try {
        const decode = jwt.verify(token, '3de113c0-757c-45be-a5ab-238221699cd2' )
        req.user = {
            id: decode.id
        }
        next()

    } catch (error) {
        if(error.name === 'TokenExpitedError') {
            res.status(405).send('Token expirado. Genere un nuevo token')
        }else {
            res.status(405).send('Token no valido')
        }
    }
}

export default validateToken