import pkg from 'pg'
import env from './global.js'

const pool = pkg.Pool({
    user: env.db.user,
    host: 'localhost',
    database: env.db.db,
    password: env.db.passwrd,
    port: env.db.port
})

export default pool