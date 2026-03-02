import pool from './pool.js'

export const findUserByUsername = async (username) => {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    )
    return rows[0] ?? null
}

export const findUserById = async (user_id) => {
    const { rows } = await pool.query(
        'SELECT user_id, username, usermail, creation_date, is_active FROM users WHERE user_id = $1',
        [user_id]
    )
    return rows[0] ?? null
}

export const insertUser = async (username, usermail, hashedPassword) => {
    const { rows } = await pool.query(`
        INSERT INTO users (username, usermail, password)
        VALUES ($1, $2, $3)
        RETURNING user_id, username, usermail, creation_date
    `,
        [username, usermail, hashedPassword]
    )
    return rows[0]
}
