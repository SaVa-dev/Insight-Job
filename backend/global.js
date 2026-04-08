import 'dotenv/config'

const splitCsv = (value, fallback = []) =>
    value
        ? value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : fallback

const parseBoolean = (value, fallback = false) => {
    if (value === undefined) return fallback
    return value === 'true'
}

const env = {
    srv: {
        port: process.env.BACKEND_PORT ?? 3000,
        jwtSecret: process.env.JWT_SECRET,
        frontendOrigins: splitCsv(process.env.FRONTEND_ORIGIN),
        cookieSecure: parseBoolean(process.env.COOKIE_SECURE, false)
    },
    db: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        usr: process.env.POSTGRES_USER,
        db: process.env.POSTGRES_DB,
        passwrd: process.env.POSTGRES_PASSWORD
    },
    notifications: {
        smtpHost: process.env.SMTP_HOST ?? 'smtp.gmail.com',
        smtpPort: Number(process.env.SMTP_PORT ?? 465),
        smtpSecure: parseBoolean(process.env.SMTP_SECURE, true),
        smtpUser: process.env.SMTP_USER ?? '',
        smtpPass: process.env.SMTP_PASS ?? '',
        fromEmail: process.env.EMAIL_FROM_EMAIL ?? '',
        fromName: process.env.EMAIL_FROM_NAME ?? 'Insight Job'
    }
}

export default env
