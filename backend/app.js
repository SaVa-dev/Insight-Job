import express from 'express'
import env from './global.js'

import authRoute from './router/auth.route.js'
import profilesRoute from './router/profiles.route.js'

const server = express();
server.use(express.json())


server.get('/testenv', (req, res) =>{
    res.send(`
        backend port: ${env.srv.port}, 
        db info: ${JSON.stringify(env.db)}
    `)
})

server.use('/auth', authRoute)
server.use('/profiles', profilesRoute)

server.listen(env.srv.port, () =>{
    console.log("Express is up and running")
})
