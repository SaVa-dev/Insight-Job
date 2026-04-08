import { useState } from 'react'
import { login as loginApi, register as registerApi, logout as logoutApi } from '../services/api'

export function useAuth() {
    const [error, setError]   = useState('')
    const [loading, setLoading] = useState(false)

    const login = async (form) => {
        setLoading(true)
        setError('')
        const data = await loginApi(form)
        setLoading(false)
        if (data.error) { setError(data.error); return false }
        return true
    }

    const register = async (form) => {
        setLoading(true)
        setError('')
        const data = await registerApi(form)
        setLoading(false)
        if (data.error) { setError(data.error); return false }
        return true
    }

    const logout = async () => {
        await logoutApi()  // el backend borra la cookie
    }

    return { error, loading, login, register, logout }
}