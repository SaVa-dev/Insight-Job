import pool from './pool.js'

// --- Profiles ---

export const createProfile = async (user_id, name, description, experience_min, experience_max) => {
    const { rows } = await pool.query(`
            INSERT INTO user_profile (user_id, name, description, experience_min, experience_max)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        [user_id, name, description ?? null, experience_min ?? null, experience_max ?? null]
    )
    return rows[0]
}

export const getProfilesByUser = async (user_id) => {
    const { rows } = await pool.query(
        `SELECT
            p.*,
            COALESCE(ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills,
            COALESCE(ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS companies,
            COALESCE(ARRAY_AGG(DISTINCT l.name) FILTER (WHERE l.name IS NOT NULL), '{}') AS locations
        FROM user_profile p
        LEFT JOIN user_profile_skill ups ON ups.user_profile_id = p.user_profile_id
        LEFT JOIN skills s ON s.skill_id = ups.skill_id
        LEFT JOIN user_profile_company upc ON upc.user_profile_id = p.user_profile_id
        LEFT JOIN companies c ON c.company_id = upc.company_id
        LEFT JOIN user_profile_location upl ON upl.user_profile_id = p.user_profile_id
        LEFT JOIN locations l ON l.location_id = upl.location_id
        WHERE p.user_id = $1 AND p.is_active = TRUE
        GROUP BY p.user_profile_id`,
        [user_id]
    )
    return rows
}

export const deleteProfile = async (profile_id, user_id) => {
    const { rows } = await pool.query(`
            UPDATE user_profile SET is_active = FALSE
            WHERE user_profile_id = $1 AND user_id = $2
            RETURNING *
        `,
        [profile_id, user_id]
    )
    return rows[0] ?? null // null si no existe o no le pertenece
}

// --- Skills ---

export const findSkillByName = async (name) => {
    const { rows } = await pool.query(
        `SELECT skill_id FROM skills WHERE LOWER(name) = LOWER($1)`,
        [name]
    )
    return rows[0] ?? null
}

export const linkSkillToProfile = async (profile_id, skill_id) => {
    await pool.query(
        `INSERT INTO user_profile_skill (user_profile_id, skill_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [profile_id, skill_id]
    )
}

// --- Companies ---

export const upsertCompany = async (name) => {
    const { rows } = await pool.query(
        `INSERT INTO companies (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING company_id`,
        [name]
    )
    return rows[0]
}

export const linkCompanyToProfile = async (profile_id, company_id) => {
    await pool.query(
        `INSERT INTO user_profile_company (user_profile_id, company_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [profile_id, company_id]
    )
}

// --- Locations ---

export const findLocationByName = async (name) => {
    const { rows } = await pool.query(
        `SELECT location_id FROM locations WHERE LOWER(name) = LOWER($1)`,
        [name]
    )
    return rows[0] ?? null
}

export const linkLocationToProfile = async (profile_id, location_id) => {
    await pool.query(
        `INSERT INTO user_profile_location (user_profile_id, location_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [profile_id, location_id]
    )
}