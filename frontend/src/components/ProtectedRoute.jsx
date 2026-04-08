// components/ProtectedRoute.jsx
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from '../services/api'

export default function ProtectedRoute({ children }) {
    const [status, setStatus] = useState('loading') // 'loading' | 'auth' | 'unauth'

    useEffect(() => {
        getMe()
            .then(data => setStatus(data.user ? 'auth' : 'unauth'))
            .catch(() => setStatus('unauth'))
    }, [])

    if (status === 'loading') return null // o un spinner
    if (status === 'unauth') return <Navigate to="/login" replace />
    return children
}