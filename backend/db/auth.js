import pool from './pool.js'

const reMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const findUser = async (username) => {
    const column = reMail.test(username) ? "usermail" : "username"
    const { rows } = await pool.query(
        `SELECT user_id, username, usermail, password FROM users WHERE ${column} = $1`,
        [username]
    )
    return rows[0] ?? null
}

export const findUserById = async (user_id) => {
    const { rows } = await pool.query(
        `SELECT user_id, username, usermail, creation_date, is_active FROM users WHERE user_id = $1`,
        [user_id]
    )
    return rows[0] ?? null
}

export const insertUser = async (username, usermail, hashedPassword) => {
    const { rows } = await pool.query(
        `INSERT INTO users (username, usermail, password)
         VALUES ($1, $2, $3)
         RETURNING user_id, username, usermail`,
        [username, usermail, hashedPassword]
    )
    return rows[0]
}

export const updateUser = async (user_id, fields) => {
    // Construye el SET dinámicamente solo con los campos que llegaron
    const keys = Object.keys(fields)
    if (keys.length === 0) return null

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    const values = [...Object.values(fields), user_id]

    const { rows } = await pool.query(
        `UPDATE users SET ${setClauses}
         WHERE user_id = $${keys.length + 1}
         RETURNING user_id, username, usermail`,
        values
    )
    return rows[0] ?? null
}
