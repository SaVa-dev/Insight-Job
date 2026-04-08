import env from './global.js'
import { createApp } from './server.js'

const server = createApp()
server.listen(env.srv.port, '0.0.0.0', () =>{
    console.log("Express is up and running at port " + env.srv.port)
})
