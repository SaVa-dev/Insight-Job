import express from 'express'
import env from './global.js'

const server = express();

server.get('/testenv', (req, res) =>{
    res.send(`backend port: ${env.srv.port}, db port: ${env.db.port}`)
})

server.listen(3000, () =>{
    console.log("Express is up and running in port 3000")
})
