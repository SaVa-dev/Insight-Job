import express from 'express'

const server = express();

server.get('/test', (req, res) =>{
    res.send('Hola mundo!')
})

server.listen(3000, () =>{
    console.log("Express is up and running in port 3000")
})
