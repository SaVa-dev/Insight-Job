import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthPanel from '../components/AuthPanel'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'
import AuthError from '../components/AuthError'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' })
    const { login, error, loading } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const ok = await login(form)
        if (ok) navigate('/dashboard')
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#080d14] font-['Sora',sans-serif]">
            <AuthPanel
                badge="Web Scraping en tiempo real"
                title="Encuentra tu"
                highlight="trabajo ideal"
                subtitle="Alertas personalizadas con las vacantes que más te interesan, cada día."
            >
                <div className="flex gap-8 mt-10">
                    {[['67K+', 'Ubicaciones'], ['113', 'Skills'], ['Diario', 'Actualización']].map(([val, label]) => (
                        <div key={label}>
                            <div className="text-2xl font-bold text-white">{val}</div>
                            <div className="text-slate-500 text-sm mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>
            </AuthPanel>

            <div className="flex flex-1 items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-[#080d14]" />
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
                />
                <div className="relative w-full max-w-sm">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Bienvenido</h2>
                        <p className="text-slate-500">Ingresa a tu cuenta para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <AuthInput label="Usuario" name="username" placeholder="tu_usuario" value={form.username} onChange={handleChange} required />
                        <AuthInput label="Contraseña" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                        <AuthError message={error} />
                        <AuthButton loading={loading} label="Iniciar sesión" loadingLabel="Iniciando sesión..." />
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Créala aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}