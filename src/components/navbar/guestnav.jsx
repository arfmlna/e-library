import { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { HashLink as NavLink } from 'react-router-hash-link'
const icon = '/icon/apple-touch-icon.png'
import { Menu, X } from 'lucide-react';

export default function GuestNav({ navlink }) {
    const [isOpen, setIsOpen] = useState(false); 

    const location = useLocation()
    const path = location.pathname

    if (path === '/sign-in' || path === '/sign-up' || path === '/forgot-password' ) {
        return null
    }
    return (
        <div className="relative">
            <nav className="fixed top-0 left-0 right-0 w-full z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-slate-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-xl shadow-sm">
                <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight flex items-center gap-3">
                    <img src={icon} alt="icon" className='w-12' />
                    ElibFour
                </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-gray-300">
                { navlink.map((items, i) => (
                    <NavLink smooth key={i} to={items?.path} className="hover:text-blue-600 transition">
                        {items?.name}
                    </NavLink>
                )) }
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <button className="text-sm font-semibold px-4 py-2 text-slate-700 dark:text-gray-200 hover:text-blue-600 transition">
                        <NavLink to={"/sign-in"}>Masuk</NavLink>
                    </button>
                    <button className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition">
                        <NavLink to={"/sign-up"}>Daftar</NavLink>
                    </button>
                </div>

                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="text-slate-600 dark:text-gray-300 p-2 focus:outline-none"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <div 
                    className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 shadow-lg p-6 flex flex-col gap-4 rounded-b-xl transition-all duration-300 md:hidden ${
                        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                    >
                    {/* Link Navigasi Mobile */}
                    <div className="flex flex-col gap-4 text-sm font-medium text-slate-600 dark:text-gray-300">
                        {navlink.map((items, i) => (
                        <NavLink 
                            key={i} 
                            to={items?.path} 
                            onClick={() => setIsOpen(false)}
                            className="hover:text-blue-600 transition py-1"
                        >
                            {items?.name}
                        </NavLink>
                        ))}
                    </div>
                    
                    <hr className="border-slate-200 dark:border-gray-800 my-1" />

                    {/* Tombol Aksi Mobile */}
                    <div className="flex flex-col gap-2">
                        <button className="w-full text-sm font-semibold px-4 py-2.5 text-center text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-gray-800 rounded-lg hover:text-blue-600 transition">
                        <NavLink to={"/sign-in"} onClick={() => setIsOpen(false)}>Masuk</NavLink>
                        </button>
                        <button className="w-full text-sm font-semibold px-4 py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition">
                        <NavLink to={"/sign-up"} onClick={() => setIsOpen(false)}>Daftar</NavLink>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}
