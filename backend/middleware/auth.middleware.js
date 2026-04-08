import jwt from 'jsonwebtoken'
import env from '../global.js'

const authenticate = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'Token requerido' })
    try {
        const decoded = jwt.verify(token, env.srv.jwtSecret)
        req.user = decoded
        next()
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' })
    }
}

export default authenticate