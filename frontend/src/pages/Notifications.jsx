import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import AuthInput from '../components/AuthInput'
import AuthError from '../components/AuthError'
import { getNotifications, sendNotification } from '../services/api'

function StatusBadge({ status }) {
  const map = {
    sent: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }

  return (
    <span className={`px-2 py-0.5 rounded-md border text-xs capitalize ${map[status] ?? 'bg-white/5 text-slate-400 border-white/10'}`}>
      {status}
    </span>
  )
}

export default function Notifications() {
  const [form, setForm] = useState({
    recipientEmail: '',
    subject: '',
    message: '',
  })
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadNotifications = async () => {
    setLoading(true)
    const data = await getNotifications()
    setNotifications(data.notifications ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setSuccess('')

    const data = await sendNotification(form)

    setSending(false)

    if (data.error) {
      setError(data.error)
      if (data.notification) {
        setNotifications((current) => [data.notification, ...current])
      }
      return
    }

    setForm({ recipientEmail: '', subject: '', message: '' })
    setSuccess('Correo enviado correctamente')
    setNotifications((current) => [data.notification, ...current])
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6">
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 h-fit">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
            <p className="text-slate-500 text-sm mt-1">Envia un correo manual y revisa el historial de entregas.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AuthInput
              label="Correo destino"
              name="recipientEmail"
              type="email"
              placeholder="destinatario@correo.com"
              value={form.recipientEmail}
              onChange={handleChange}
              required
            />
            <AuthInput
              label="Asunto"
              name="subject"
              placeholder="Nueva notificacion de Insight Job"
              value={form.subject}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-sm font-medium">Mensaje</label>
              <textarea
                name="message"
                rows={6}
                placeholder="Escribe el mensaje que quieres enviar..."
                value={form.message}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all resize-none text-sm"
              />
            </div>

            <AuthError message={error} />
            {success && (
              <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Enviando correo...' : 'Enviar correo'}
            </button>
          </form>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Historial</h2>
              <p className="text-slate-500 text-sm mt-1">Ultimos correos enviados o fallidos.</p>
            </div>
            <button
              type="button"
              onClick={loadNotifications}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-all"
            >
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              No hay notificaciones registradas todavia.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <div key={notification.notification_id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{notification.subject}</p>
                      <p className="text-slate-500 text-sm mt-1">{notification.recipient_email}</p>
                    </div>
                    <StatusBadge status={notification.status} />
                  </div>

                  <p className="text-slate-300 text-sm mt-3 whitespace-pre-wrap">{notification.message}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-4">
                    <span>Creado: {new Date(notification.created_at).toLocaleString()}</span>
                    {notification.sent_at && <span>Enviado: {new Date(notification.sent_at).toLocaleString()}</span>}
                    {notification.error_message && <span className="text-red-400">Error: {notification.error_message}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
