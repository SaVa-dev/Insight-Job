import express from 'express'
import authenticate from '../middleware/auth.middleware.js'
import {
    createProfile,
    getProfilesByUser,
    deleteProfile,
    findSkillByName,
    linkSkillToProfile,
    upsertCompany,
    linkCompanyToProfile,
    findLocationByName,
    linkLocationToProfile
} from '../db/profiles.js'

const router = express.Router()

// Todos los endpoints requieren autenticación
router.use(authenticate)

// POST /profiles
router.post('/', async (req, res) => {
    const { name, description, experience_min, experience_max, skills, companies, locations } = req.body
    const user_id = req.user.user_id

    if (!name) return res.status(400).json({ error: 'El nombre del perfil es requerido' })

    try {
        const profile = await createProfile(user_id, name, description, experience_min, experience_max)
        const profile_id = profile.user_profile_id

        const errors = []

        // Vincular skills
        if (Array.isArray(skills)) {
            for (const skillName of skills) {
                const skill = await findSkillByName(skillName)
                if (!skill) {
                    errors.push(`Skill no encontrada: "${skillName}"`)
                    continue
                }
                await linkSkillToProfile(profile_id, skill.skill_id)
            }
        }

        // Vincular companies (crea si no existe)
        if (Array.isArray(companies)) {
            for (const companyName of companies) {
                const company = await upsertCompany(companyName)
                await linkCompanyToProfile(profile_id, company.company_id)
            }
        }

        // Vincular locations
        if (Array.isArray(locations)) {
            for (const locationName of locations) {
                const location = await findLocationByName(locationName)
                if (!location) {
                    errors.push(`Location no encontrada: "${locationName}"`)
                    continue
                }
                await linkLocationToProfile(profile_id, location.location_id)
            }
        }

        res.status(201).json({
            profile,
            ...(errors.length > 0 && { warnings: errors })
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// GET /profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await getProfilesByUser(req.user.user_id)
        res.json({ profiles })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// DELETE /profiles/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await deleteProfile(req.params.id, req.user.user_id)
        if (!deleted) return res.status(404).json({ error: 'Perfil no encontrado' })
        res.json({ message: 'Perfil eliminado', profile: deleted })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

export default router