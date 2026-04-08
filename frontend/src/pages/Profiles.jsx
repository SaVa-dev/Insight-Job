import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { getProfiles, deleteProfile } from '../services/api'

export default function Profiles() {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProfiles = async () => {
        const data = await getProfiles()
        setProfiles(data.profiles ?? [])
        setLoading(false)
    }

    useEffect(() => { fetchProfiles() }, [])

    const handleDelete = async (id) => {
        await deleteProfile(id)
        setProfiles(profiles.filter(p => p.user_profile_id !== id))
    }

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Perfiles de búsqueda</h1>
                    <p className="text-slate-500 text-sm mt-1">Configura tus preferencias para recibir alertas personalizadas</p>
                </div>
                <Link
                    to="/profiles/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo perfil
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                </div>
            ) : profiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <p className="text-slate-400 font-medium mb-1">No tienes perfiles todavía</p>
                    <p className="text-slate-600 text-sm mb-6">Crea uno para empezar a recibir alertas</p>
                    <Link to="/profiles/new" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                        Crear primer perfil →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map(profile => (
                        <div key={profile.user_profile_id} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-blue-500/20 transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-white font-semibold">{profile.name}</h3>
                                    {profile.description && (
                                        <p className="text-slate-500 text-sm mt-0.5 line-clamp-2">{profile.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(profile.user_profile_id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Experiencia */}
                            {(profile.experience_min || profile.experience_max) && (
                                <div className="flex items-center gap-1.5 mb-3">
                                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-slate-500 text-xs">
                                        {profile.experience_min ?? 0} - {profile.experience_max ?? '∞'} años
                                    </span>
                                </div>
                            )}

                            {/* Skills */}
                            {profile.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {profile.skills.slice(0, 4).map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs border border-blue-500/15">{s}</span>
                                    ))}
                                    {profile.skills.length > 4 && (
                                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-500 text-xs">+{profile.skills.length - 4}</span>
                                    )}
                                </div>
                            )}

                            {/* Locations */}
                            {profile.locations?.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span className="text-slate-600 text-xs">{profile.locations.slice(0, 2).join(', ')}{profile.locations.length > 2 ? ` +${profile.locations.length - 2}` : ''}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    )
}