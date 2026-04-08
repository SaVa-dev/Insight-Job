import test from 'node:test'
import assert from 'node:assert/strict'
import { listNotifications, sendNotification } from '../services/notification.service.js'

test('sendNotification validates required fields', async () => {
    await assert.rejects(
        () => sendNotification({ userId: 'user-1', recipientEmail: '', subject: '', message: '' }),
        /required/
    )
})

test('sendNotification stores a sent notification', async () => {
    const notifications = []
    const notificationDb = {
        async createNotification(payload) {
            const record = { notification_id: 'notification-1', ...payload, status: 'pending' }
            notifications.push(record)
            return record
        },
        async completeNotification(notificationId, update) {
            return { notification_id: notificationId, ...notifications[0], ...update }
        }
    }
    const emailClient = {
        async sendEmail() {
            return { providerMessageId: 'provider-1', providerResponse: { id: 'provider-1' } }
        }
    }

    const result = await sendNotification(
        {
            userId: 'user-1',
            recipientEmail: 'receiver@example.com',
            subject: 'Hello',
            message: 'Body'
        },
        { notificationDb, emailClient }
    )

    assert.equal(result.status, 'sent')
    assert.equal(result.providerMessageId, 'provider-1')
})

test('sendNotification stores a failed notification when provider fails', async () => {
    const notificationDb = {
        async createNotification(payload) {
            return { notification_id: 'notification-2', ...payload, status: 'pending' }
        },
        async completeNotification(notificationId, update) {
            return { notification_id: notificationId, ...update }
        }
    }
    const emailClient = {
        async sendEmail() {
            throw new Error('provider timeout')
        }
    }

    await assert.rejects(
        () => sendNotification(
            {
                userId: 'user-1',
                recipientEmail: 'receiver@example.com',
                subject: 'Hello',
                message: 'Body'
            },
            { notificationDb, emailClient }
        ),
        (error) => {
            assert.equal(error.statusCode, 502)
            assert.equal(error.notification.status, 'failed')
            return true
        }
    )
})

test('listNotifications returns notifications from the repository', async () => {
    const expected = [{ notification_id: 'notification-3', status: 'sent' }]
    const result = await listNotifications('user-1', {
        notificationDb: {
            async getNotificationsByUser() {
                return expected
            }
        }
    })

    assert.deepEqual(result, expected)
})
