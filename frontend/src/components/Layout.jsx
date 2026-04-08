import Navbar from './Navbar'

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#080d14] font-['Sora',sans-serif]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}