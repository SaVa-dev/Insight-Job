import env from '../global.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (value) => emailRegex.test(value)

const buildSender = () => {
    const { fromEmail, fromName } = env.notifications

    if (!fromEmail) {
        throw new Error('Email sender is not configured')
    }

    return fromName
        ? { email: fromEmail, name: fromName }
        : { email: fromEmail }
}

const createTransporter = async (transporterFactory) => {
    if (transporterFactory) {
        return transporterFactory()
    }

    const nodemailer = await import('nodemailer')

    return nodemailer.createTransport({
        host: env.notifications.smtpHost,
        port: env.notifications.smtpPort,
        secure: env.notifications.smtpSecure,
        auth: {
            user: env.notifications.smtpUser,
            pass: env.notifications.smtpPass
        }
    })
}

export const sendEmail = async (
    { recipientEmail, subject, message },
    { transporterFactory } = {}
) => {
    if (!env.notifications.smtpUser || !env.notifications.smtpPass) {
        throw new Error('SMTP credentials are not configured')
    }

    const transporter = await createTransporter(transporterFactory)

    const result = await transporter.sendMail({
        from: buildSender(),
        to: recipientEmail,
        subject,
        text: message
    })

    return {
        providerMessageId: result.messageId ?? null,
        providerResponse: {
            accepted: result.accepted ?? [],
            rejected: result.rejected ?? [],
            response: result.response ?? null
        }
    }
}
