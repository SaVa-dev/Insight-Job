const env = {
    srv: {
        port: process.env.BACKEND_PORT,
        jwtSecret: process.env.JWT_SECRET
    },
    db: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        usr: process.env.POSTGRES_USER,
        db: process.env.POSTGRES_DB,
        passwrd: process.env.POSTGRES_PASSWORD
    }
}

export default env