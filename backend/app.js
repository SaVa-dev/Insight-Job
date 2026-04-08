import express from 'express'
import env from './global.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoute from './router/auth.route.js'
import profilesRoute from './router/profiles.route.js'

const server = express();
server.use(express.json())
server.use(cookieParser())
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


server.get('/testenv', (req, res) =>{
    res.send(`
        backend port: ${env.srv.port}, 
        db info: ${JSON.stringify(env.db)}
    `)
})

server.use('/auth', authRoute)
server.use('/profiles', profilesRoute)

server.listen(env.srv.port, '0.0.0.0', () =>{
    console.log("Express is up and running at port " + env.srv.port)
})
