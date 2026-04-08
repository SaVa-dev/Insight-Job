import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import AuthInput from '../components/AuthInput'
import AuthError from '../components/AuthError'
import { createProfile } from '../services/api'

function TagInput({ label, placeholder, values, onChange }) {
    const [input, setInput] = useState('')

    const add = () => {
        const val = input.trim()
        if (val && !values.includes(val)) onChange([...values, val])
        setInput('')
    }

    const remove = (val) => onChange(values.filter(v => v !== val))

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-sm font-medium">{label}</label>
            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500/50 focus-within:bg-blue-500/5 transition-all">
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {values.map(v => (
                        <span key={v} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                            {v}
                            <button type="button" onClick={() => remove(v)} className="hover:text-blue-200 transition-colors">×</button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={add}
                        className="text-slate-500 hover:text-blue-400 text-xs transition-colors px-1"
                    >
                        + Agregar
                    </button>
                </div>
            </div>
            <p className="text-slate-600 text-xs">Presiona Enter o click en Agregar</p>
        </div>
    )
}

export default function NewProfile() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [warnings, setWarnings] = useState([])

    const [form, setForm] = useState({
        name: '',
        description: '',
        experience_min: '',
        experience_max: '',
    })
    const [skills, setSkills] = useState([])
    const [companies, setCompanies] = useState([])
    const [locations, setLocations] = useState([])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name) { setError('El nombre es requerido'); return }
        setLoading(true)
        setError('')

        const data = await createProfile({
            ...form,
            experience_min: form.experience_min ? parseFloat(form.experience_min) : null,
            experience_max: form.experience_max ? parseFloat(form.experience_max) : null,
            skills,
            companies,
            locations
        })

        setLoading(false)

        if (data.error) { setError(data.error); return }
        if (data.warnings?.length) { setWarnings(data.warnings) }
        else navigate('/profiles')
    }

    return (
        <Layout>
            <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => navigate('/profiles')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                    <h1 className="text-2xl font-bold text-white">Nuevo perfil</h1>
                    <p className="text-slate-500 text-sm mt-1">Define tus preferencias de búsqueda</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Info básica */}
                    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Información básica</p>
                        <AuthInput label="Nombre del perfil" name="name" placeholder="Ej: Backend Senior CDMX" value={form.name} onChange={handleChange} required />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-400 text-sm font-medium">Descripción <span className="text-slate-600">(opcional)</span></label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe qué tipo de trabajo buscas..."
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all resize-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Experiencia */}
                    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Experiencia</p>
                        <div className="grid grid-cols-2 gap-3">
                            <AuthInput label="Mínimo (años)" name="experience_min" type="number" placeholder="0" value={form.experience_min} onChange={handleChange} />
                            <AuthInput label="Máximo (años)" name="experience_max" type="number" placeholder="∞" value={form.experience_max} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Preferencias */}
                    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Preferencias</p>
                        <TagInput label="Skills" placeholder="Ej: Python, Docker..." values={skills} onChange={setSkills} />
                        <TagInput label="Empresas" placeholder="Ej: Clip, Kueski..." values={companies} onChange={setCompanies} />
                        <TagInput label="Ubicaciones" placeholder="Ej: Mexico City, Guadalajara..." values={locations} onChange={setLocations} />
                    </div>

                    <AuthError message={error} />

                    {warnings.length > 0 && (
                        <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-yellow-400 text-sm font-medium">Perfil creado con advertencias:</p>
                            {warnings.map((w, i) => <p key={i} className="text-yellow-400/70 text-xs">{w}</p>)}
                            <button type="button" onClick={() => navigate('/profiles')} className="text-yellow-400 text-sm mt-1 hover:underline text-left">
                                Ver mis perfiles →
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                Creando perfil...
                            </span>
                        ) : 'Crear perfil'}
                    </button>
                </form>
            </div>
        </Layout>
    )
}