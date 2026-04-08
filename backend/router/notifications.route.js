import express from 'express'
import authenticate from '../middleware/auth.middleware.js'
import { listNotifications, sendNotification } from '../services/notification.service.js'

export const createListNotificationsHandler = (deps = {}) => async (req, res) => {
    try {
        const notifications = await listNotifications(req.user.user_id, deps)
        res.status(200).json({ notifications })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const createSendNotificationHandler = (deps = {}) => async (req, res) => {
    const { recipientEmail, subject, message } = req.body

    try {
        const notification = await sendNotification(
            {
                userId: req.user.user_id,
                recipientEmail,
                subject,
                message
            },
            deps
        )

        res.status(201).json({ notification })
    } catch (err) {
        console.error(err)
        res.status(err.statusCode ?? 500).json({
            error: err.message ?? 'Internal server error',
            notification: err.notification ?? null
        })
    }
}

export const createNotificationsRouter = (deps = {}) => {
    const router = express.Router()
    const authMiddleware = deps.authMiddleware ?? authenticate

    router.use(authMiddleware)
    router.get('/', createListNotificationsHandler(deps))
    router.post('/send', createSendNotificationHandler(deps))

    return router
}

export default createNotificationsRouter
