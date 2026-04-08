import pool from './pool.js'

export const createNotification = async ({ userId, recipientEmail, subject, message }) => {
    const { rows } = await pool.query(
        `INSERT INTO email_notification (user_id, recipient_email, subject, message)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, recipientEmail, subject, message]
    )

    return rows[0]
}

export const completeNotification = async (
    notificationId,
    { status, providerMessageId = null, providerResponse = null, errorMessage = null, sentAt = null }
) => {
    const { rows } = await pool.query(
        `UPDATE email_notification
         SET status = $2,
             provider_message_id = $3,
             provider_response = $4,
             error_message = $5,
             sent_at = $6
         WHERE notification_id = $1
         RETURNING *`,
        [notificationId, status, providerMessageId, providerResponse, errorMessage, sentAt]
    )

    return rows[0]
}

export const getNotificationsByUser = async (userId) => {
    const { rows } = await pool.query(
        `SELECT notification_id,
                recipient_email,
                subject,
                message,
                status,
                provider_message_id,
                error_message,
                created_at,
                sent_at
         FROM email_notification
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    )

    return rows
}
