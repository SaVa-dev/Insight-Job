export default function AuthPanel({ badge, title, highlight, subtitle, children }) {
  return (
    <div className="relative hidden lg:flex w-1/2 flex-col justify-between p-14 overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0a1628] via-[#0d1f3c] to-[#051020]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl" />

      {/* Logo */}
      <div className="relative flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">Insight Job</span>
      </div>

      {/* Contenido */}
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs font-medium tracking-wider uppercase">{badge}</span>
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          {title}<br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
            {highlight}
          </span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">{subtitle}</p>
        {children}
      </div>

      <div className="relative text-slate-600 text-sm">© 2026 Insight Job</div>
    </div>
  )
}