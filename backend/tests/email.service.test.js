import test from 'node:test'
import assert from 'node:assert/strict'

process.env.SMTP_USER = 'sender@gmail.com'
process.env.SMTP_PASS = 'app-password'
process.env.EMAIL_FROM_EMAIL = 'sandbox@example.com'
process.env.EMAIL_FROM_NAME = 'Insight Job'
process.env.SMTP_HOST = 'smtp.gmail.com'
process.env.SMTP_PORT = '465'
process.env.SMTP_SECURE = 'true'

const { isValidEmail, sendEmail } = await import('../services/email.service.js')

test('isValidEmail validates a basic email format', () => {
    assert.equal(isValidEmail('user@example.com'), true)
    assert.equal(isValidEmail('invalid-email'), false)
})

test('sendEmail sends a request to the provider API', async () => {
    const sendMailCalls = []
    const transporterFactory = () => ({
        async sendMail(payload) {
            sendMailCalls.push(payload)
            return {
                messageId: 'provider-123',
                accepted: ['receiver@example.com'],
                rejected: [],
                response: '250 OK'
            }
        }
    })

    const result = await sendEmail(
        {
            recipientEmail: 'receiver@example.com',
            subject: 'Test subject',
            message: 'Hello from test'
        },
        { transporterFactory }
    )

    assert.equal(sendMailCalls.length, 1)
    assert.deepEqual(sendMailCalls[0].from, { email: 'sandbox@example.com', name: 'Insight Job' })
    assert.equal(sendMailCalls[0].to, 'receiver@example.com')
    assert.equal(result.providerMessageId, 'provider-123')
})

test('sendEmail throws when SMTP transport returns an error', async () => {
    const transporterFactory = () => ({
        async sendMail() {
            throw new Error('smtp failed')
        }
    })

    await assert.rejects(
        () => sendEmail(
            {
                recipientEmail: 'receiver@example.com',
                subject: 'Test subject',
                message: 'Hello from test'
            },
            { transporterFactory }
        ),
        /smtp failed/
    )
})
