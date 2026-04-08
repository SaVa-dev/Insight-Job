import test from 'node:test'
import assert from 'node:assert/strict'
import {
    createListNotificationsHandler,
    createSendNotificationHandler
} from '../router/notifications.route.js'

const createMockResponse = () => {
    const response = {
        statusCode: 200,
        payload: null,
        status(code) {
            this.statusCode = code
            return this
        },
        json(body) {
            this.payload = body
            return this
        }
    }

    return response
}

test('notifications list handler returns notification list', async () => {
    const handler = createListNotificationsHandler({
        notificationDb: {
            async getNotificationsByUser() {
                return [{ notification_id: 'notification-1', status: 'sent' }]
            }
        }
    })
    const response = createMockResponse()

    await handler(
        { user: { user_id: 'user-1' } },
        response
    )

    assert.equal(response.statusCode, 200)
    assert.equal(response.payload.notifications.length, 1)
})

test('notifications send handler returns created notification', async () => {
    const handler = createSendNotificationHandler({
        notificationDb: {
            async createNotification(payload) {
                return { notification_id: 'notification-2', ...payload, status: 'pending' }
            },
            async completeNotification(notificationId, update) {
                return { notification_id: notificationId, ...update }
            }
        },
        emailClient: {
            async sendEmail() {
                return { providerMessageId: 'provider-2', providerResponse: { id: 'provider-2' } }
            }
        }
    })
    const response = createMockResponse()

    await handler(
        {
            user: { user_id: 'user-1' },
            body: {
                recipientEmail: 'receiver@example.com',
                subject: 'Hello',
                message: 'Body'
            }
        },
        response
    )

    assert.equal(response.statusCode, 201)
    assert.equal(response.payload.notification.status, 'sent')
})
