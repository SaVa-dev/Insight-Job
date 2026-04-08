import { completeNotification, createNotification, getNotificationsByUser } from '../db/notifications.js'
import { isValidEmail, sendEmail } from './email.service.js'

const validatePayload = ({ recipientEmail, subject, message }) => {
    if (!recipientEmail || !subject || !message) {
        const error = new Error('Recipient email, subject and message are required')
        error.statusCode = 400
        throw error
    }

    if (!isValidEmail(recipientEmail)) {
        const error = new Error('Recipient email is invalid')
        error.statusCode = 400
        throw error
    }
}

export const sendNotification = async (
    { userId, recipientEmail, subject, message },
    deps = {}
) => {
    const notificationDb = deps.notificationDb ?? {
        createNotification,
        completeNotification
    }
    const emailClient = deps.emailClient ?? { sendEmail }

    validatePayload({ recipientEmail, subject, message })

    const notification = await notificationDb.createNotification({
        userId,
        recipientEmail,
        subject,
        message
    })

    try {
        const delivery = await emailClient.sendEmail({ recipientEmail, subject, message })

        return notificationDb.completeNotification(notification.notification_id, {
            status: 'sent',
            providerMessageId: delivery.providerMessageId,
            providerResponse: delivery.providerResponse,
            sentAt: new Date().toISOString()
        })
    } catch (err) {
        const failedNotification = await notificationDb.completeNotification(notification.notification_id, {
            status: 'failed',
            errorMessage: err.message
        })

        const error = new Error(err.message)
        error.statusCode = err.statusCode ?? 502
        error.notification = failedNotification
        throw error
    }
}

export const listNotifications = async (userId, deps = {}) => {
    const notificationDb = deps.notificationDb ?? { getNotificationsByUser }
    return notificationDb.getNotificationsByUser(userId)
}
