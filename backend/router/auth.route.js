import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { findUserByUsername, findUserById, insertUser } from '../db/auth.js'
import authenticate from '../middleware/auth.middleware.js'
import env from '../global.js'

const router = express.Router()

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, usermail, password } = req.body

    if (!username || !usermail || !password)
        return res.status(400).json({ error: 'Faltan campos requeridos' })

    try {
        const existing = await findUserByUsername(username)
        if (existing) return res.status(409).json({ error: 'El usuario ya existe' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await insertUser(username, usermail, hashedPassword)

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            env.srv.jwtSecret,
            { expiresIn: '7d' }
        )

        res.status(201).json({ user, token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        return res.status(400).json({ error: 'Faltan campos requeridos' })

    try {
        const user = await findUserByUsername(username)
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' })

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            env.srv.jwtSecret,
            { expiresIn: '7d' }
        )

        const { password: _, ...userWithoutPassword } = user
        res.json({ user: userWithoutPassword, token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// POST /auth/logout
router.post('/logout', authenticate, (req, res) => {
    res.json({ message: 'Sesión cerrada' })
})

// GET /auth/me
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await findUserById(req.user.user_id)
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

export default router