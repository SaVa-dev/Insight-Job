import { Pool } from 'pg'
import env from '../global.js'

const pool = new Pool({
    user: env.db.usr,
    host: env.db.host,
    database: env.db.db,
    password: env.db.passwrd,
    port: env.db.port
})

export default pool