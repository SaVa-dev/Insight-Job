import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { findUser, findUserById, insertUser, updateUser } from '../db/auth.js'
import authenticate from '../middleware/auth.middleware.js'
import env from '../global.js'

const router = express.Router()

const cookieOptions = {
    httpOnly: true,
    secure: env.srv.cookieSecure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const signToken = (user) =>
    jwt.sign(
        { user_id: user.user_id, username: user.username },
        env.srv.jwtSecret,
        { expiresIn: '7d' }
    )

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ error: 'Invalid credentials' })
    try {
        const user = await findUser(username)
        if (!user) return res.status(401).json({ error: 'Invalid credentials' })

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' })

        const token = signToken(user)
        delete user.password

        res.cookie('token', token, cookieOptions)
        res.status(200).json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, usermail, password } = req.body
    if (!username || !usermail || !password)
        return res.status(400).json({ error: 'Missing required fields' })
    try {
        const existing = await findUser(usermail)
        if (existing) return res.status(409).json({ error: 'Email already exists' })
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await insertUser(username, usermail, hashedPassword)
        const token = signToken(user)
        res.cookie('token', token, cookieOptions)
        res.status(201).json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /auth/logout
router.post('/logout', authenticate, (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite
    })
    res.status(200).json({ message: 'Logged out' })
})

// GET /auth/me
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await findUserById(req.user.user_id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.status(200).json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// PATCH /auth/me
router.patch('/me', authenticate, async (req, res) => {
    const { username, usermail, password } = req.body
    try {
        const fields = {}
        if (username) fields.username = username
        if (usermail) fields.usermail = usermail
        if (password) fields.password = await bcrypt.hash(password, 10)

        if (Object.keys(fields).length === 0)
            return res.status(400).json({ error: 'No hay campos para actualizar' })

        const user = await updateUser(req.user.user_id, fields)
        res.status(200).json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router
