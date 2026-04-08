// components/PublicRoute.jsx
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from '../services/api'

export default function PublicRoute({ children }) {
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        getMe()
            .then(data => setStatus(data.user ? 'auth' : 'unauth'))
            .catch(() => setStatus('unauth'))
    }, [])

    if (status === 'loading') return (
        <div className="flex h-screen items-center justify-center bg-[#080d14]">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
    )

    if (status === 'auth') return <Navigate to="/dashboard" replace />
    return children
}