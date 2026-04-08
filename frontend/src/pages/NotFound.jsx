import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getMe } from '../services/api'

export default function NotFound() {
    const [dest, setDest] = useState('/login')

    useEffect(() => {
        getMe()
            .then(data => setDest(data.user ? '/dashboard' : '/login'))
            .catch(() => setDest('/login'))
    }, [])

    return (
        <div className="flex h-screen items-center justify-center bg-[#080d14] font-['Sora',sans-serif]">
            <div className="text-center">
                <p className="text-blue-500 font-bold text-lg mb-2">404</p>
                <h1 className="text-4xl font-bold text-white mb-4">Página no encontrada</h1>
                <Link to={dest} className="text-blue-400 hover:text-blue-300 transition-colors">
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}