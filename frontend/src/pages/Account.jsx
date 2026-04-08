import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import AuthInput from '../components/AuthInput'
import AuthError from '../components/AuthError'
import { getMe, updateMe } from '../services/api'

function Section({ title, children }) {
    return (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
            {children}
        </div>
    )
}

function SaveButton({ loading, label = 'Guardar cambios' }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="self-end px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Guardando...' : label}
        </button>
    )
}

export default function Account() {
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)

    // Formulario info básica
    const [infoForm, setInfoForm] = useState({ username: '', usermail: '' })
    const [infoLoading, setInfoLoading] = useState(false)
    const [infoError, setInfoError] = useState('')
    const [infoSuccess, setInfoSuccess] = useState(false)

    // Formulario contraseña
    const [passForm, setPassForm] = useState({ password: '', confirm: '' })
    const [passLoading, setPassLoading] = useState(false)
    const [passError, setPassError] = useState('')
    const [passSuccess, setPassSuccess] = useState(false)

    useEffect(() => {
        getMe().then(data => {
            setUser(data.user)
            setInfoForm({ username: data.user.username, usermail: data.user.usermail })
            setLoadingUser(false)
        })
    }, [])

    const handleInfoSubmit = async (e) => {
        e.preventDefault()
        setInfoLoading(true)
        setInfoError('')
        setInfoSuccess(false)
        const data = await updateMe({ username: infoForm.username, usermail: infoForm.usermail })
        setInfoLoading(false)
        if (data.error) { setInfoError(data.error); return }
        setUser(data.user)
        setInfoSuccess(true)
        setTimeout(() => setInfoSuccess(false), 3000)
    }

    const handlePassSubmit = async (e) => {
        e.preventDefault()
        if (passForm.password !== passForm.confirm) {
            setPassError('Las contraseñas no coinciden')
            return
        }
        setPassLoading(true)
        setPassError('')
        setPassSuccess(false)
        const data = await updateMe({ password: passForm.password })
        setPassLoading(false)
        if (data.error) { setPassError(data.error); return }
        setPassForm({ password: '', confirm: '' })
        setPassSuccess(true)
        setTimeout(() => setPassSuccess(false), 3000)
    }

    if (loadingUser) return (
        <Layout>
            <div className="flex justify-center py-20">
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
        </Layout>
    )

    return (
        <Layout>
            <div className="max-w-lg mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Mi cuenta</h1>
                    <p className="text-slate-500 text-sm mt-1">Administra tu información personal</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-8 p-5 bg-white/3 border border-white/8 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <span className="text-blue-400 text-2xl font-bold">
                            {user.username[0].toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-white font-semibold">{user.username}</p>
                        <p className="text-slate-500 text-sm">{user.usermail}</p>
                    </div>
                </div>

                {/* Info básica */}
                <form onSubmit={handleInfoSubmit} className="flex flex-col gap-5 mb-5">
                    <Section title="Información básica">
                        <AuthInput
                            label="Nombre de usuario"
                            name="username"
                            value={infoForm.username}
                            onChange={e => setInfoForm({ ...infoForm, username: e.target.value })}
                            required
                        />
                        <AuthInput
                            label="Correo electrónico"
                            name="usermail"
                            type="email"
                            value={infoForm.usermail}
                            onChange={e => setInfoForm({ ...infoForm, usermail: e.target.value })}
                            required
                        />
                        <AuthError message={infoError} />
                        {infoSuccess && (
                            <p className="text-green-400 text-sm">✓ Información actualizada</p>
                        )}
                        <SaveButton loading={infoLoading} />
                    </Section>
                </form>

                {/* Contraseña */}
                <form onSubmit={handlePassSubmit} className="flex flex-col gap-5">
                    <Section title="Cambiar contraseña">
                        <AuthInput
                            label="Nueva contraseña"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={passForm.password}
                            onChange={e => setPassForm({ ...passForm, password: e.target.value })}
                            required
                        />
                        <AuthInput
                            label="Confirmar contraseña"
                            name="confirm"
                            type="password"
                            placeholder="••••••••"
                            value={passForm.confirm}
                            onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
                            required
                        />
                        <AuthError message={passError} />
                        {passSuccess && (
                            <p className="text-green-400 text-sm">✓ Contraseña actualizada</p>
                        )}
                        <SaveButton loading={passLoading} label="Cambiar contraseña" />
                    </Section>
                </form>
            </div>
        </Layout>
    )
}