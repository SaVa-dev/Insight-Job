import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import env from './global.js'

import authRoute from './router/auth.route.js'
import profilesRoute from './router/profiles.route.js'
import createNotificationsRouter from './router/notifications.route.js'

export const createApp = (deps = {}) => {
    const server = express()

    const corsOptions = {
        origin(origin, callback) {
            if (!origin || env.srv.frontendOrigins.length === 0 || env.srv.frontendOrigins.includes(origin)) {
                callback(null, true)
                return
            }

            callback(new Error('Origin not allowed by CORS'))
        },
        credentials: true
    }

    server.use(express.json())
    server.use(cookieParser())
    server.use(cors(corsOptions))

    server.get('/testenv', (_req, res) =>{
        res.send(`
        backend port: ${env.srv.port}, 
        db info: ${JSON.stringify(env.db)}
    `)
    })

    server.get('/healthz', (_req, res) => {
        res.status(200).json({ status: 'ok' })
    })

    server.use('/auth', authRoute)
    server.use('/profiles', profilesRoute)
    server.use('/notifications', createNotificationsRouter(deps))

    return server
}
