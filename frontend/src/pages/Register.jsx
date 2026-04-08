import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthPanel from '../components/AuthPanel'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'
import AuthError from '../components/AuthError'

export default function Register() {
  const [form, setForm] = useState({ username: '', usermail: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, usermail: form.usermail, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear la cuenta')
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080d14] font-['Sora',sans-serif]">
      <AuthPanel
        badge="Empieza hoy"
        title="Crea tu perfil"
        highlight="en segundos"
        subtitle="Configura tus preferencias y recibe alertas con las vacantes perfectas para ti."
      >
        <div className="flex flex-col gap-4 mt-10">
          {[
            ['01', 'Crea tu cuenta'],
            ['02', 'Configura tus perfiles de búsqueda'],
            ['03', 'Recibe alertas diarias'],
          ].map(([num, text]) => (
            <div key={num} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <span className="text-blue-400 text-xs font-bold">{num}</span>
              </div>
              <span className="text-slate-300 text-sm">{text}</span>
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
            <h2 className="text-3xl font-bold text-white mb-2">Crear cuenta</h2>
            <p className="text-slate-500">Completa los datos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AuthInput label="Usuario" name="username" placeholder="tu_usuario" value={form.username} onChange={handleChange} required />
            <AuthInput label="Correo" name="usermail" type="email" placeholder="tu@correo.com" value={form.usermail} onChange={handleChange} required />
            <AuthInput label="Contraseña" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            <AuthInput label="Confirmar contraseña" name="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
            <AuthError message={error} />
            <AuthButton loading={loading} label="Crear cuenta" loadingLabel="Creando cuenta..." />
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}