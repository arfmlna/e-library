import { useLocation } from 'react-router-dom'
import { HashLink as NavLink } from 'react-router-hash-link'

export default function GuestNav({ navlink }) {
    const location = useLocation()
    const path = location.pathname
    if (path === '/sign-in' || path === '/sign-up' || path === '/forgot-password' ) {
        return null
    }
    return (
        <div className="relative">
            <nav className="fixed top-0 left-0 right-0 w-full z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-slate-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-xl shadow-sm">
                <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">📚 RuangBaca</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-gray-300">
                { navlink.map((items, i) => (
                    <NavLink smooth key={i} to={items?.path} className="hover:text-blue-600 transition">
                        {items?.name}
                    </NavLink>
                )) }
                </div>
                <div className="flex items-center gap-3">
                <button className="text-sm font-semibold px-4 py-2 text-slate-700 dark:text-gray-200 hover:text-blue-600 transition">
                    <NavLink to={"/sign-in"}>
                        Masuk
                    </NavLink>
                </button>
                <button className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition">
                    <NavLink to={"/sign-up"}>
                        Daftar
                    </NavLink>
                </button>
                </div>
            </nav>
        </div>
    )
}
