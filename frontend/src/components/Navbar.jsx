import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getMe } from '../services/api'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    )},
    { path: '/profiles', label: 'Perfiles', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    )},
    { path: '/notifications', label: 'Notificaciones', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    )},
]

export default function Navbar() {
    const { pathname } = useLocation()
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        getMe().then(data => { if (data.user) setUser(data.user) })
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <nav className="w-full bg-[#0a1120] border-b border-white/5 px-6 flex items-center justify-between h-14 font-['Sora',sans-serif]">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className="text-white font-semibold text-sm tracking-tight">Insight Job</span>
            </Link>

            {/* Nav items */}
            <div className="flex items-center gap-1">
                {navItems.map(({ path, label, icon }) => {
                    const active = pathname === path || pathname.startsWith(path + '/')
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                                active
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                        >
                            {icon}
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </div>

            {/* Avatar + menú */}
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <span className="text-blue-400 text-xs font-bold">
                            {user ? user.username[0].toUpperCase() : '?'}
                        </span>
                    </div>
                    <span className="text-slate-400 text-sm">{user?.username}</span>
                    <svg className={`w-3.5 h-3.5 text-slate-600 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-[#0d1828] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                        <Link
                            to="/account"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Mi cuenta
                        </Link>
                        <div className="border-t border-white/5" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}