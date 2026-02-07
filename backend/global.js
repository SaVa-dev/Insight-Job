const env = {
    srv: {
        port: process.env.BACKEND_PORT
    },
    db: {
        port: process.env.POSTGRES_PORT,
        usr: process.env.POSTGRES_USER,
        db: process.env.POSTGRES_DB,
        passwrd: process.env.POSTGRES_PASSWORD
    }
}

export default env