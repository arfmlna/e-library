import React, { Suspense, useEffect, useRef } from 'react'
import { FaBars, FaChevronDown, FaXmark } from 'react-icons/fa6';
import DarkMode from '../switch/DarkMode';
import { NavLink } from 'react-router-dom';
import anonim from '/anonim.jpg'
import { LogOut } from 'lucide-react';
import { useClickOutside } from '@/constants/useClickOutside';

export default function Mobile({ 
    isOnline,
    navlink,
    navBtn,
    setNavBtn,
    openSubIndex,
    toggleSublink,
    handleLogout
    }) {
    const dropdownRef = useRef(null);

    useClickOutside(dropdownRef, () => setNavBtn(false));

    return (
        <div className="block md:hidden">
            <div className='w-full fixed top-0 left-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm'
            ref={dropdownRef}>
                <nav className='px-4 py-3 w-full'>
                    <div className="flex flex-row items-center justify-between gap-3">
                        <button 
                            onClick={() => setNavBtn(!navBtn)} 
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            {navBtn ? (
                                <FaXmark className="text-2xl text-slate-700 dark:text-slate-200 transition-transform duration-300 rotate-90" />
                            ) : (
                                <FaBars className="text-2xl text-slate-700 dark:text-slate-200 transition-transform duration-300" />
                            )}
                        </button>
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-4">
                            <Suspense fallback={<div className="w-6 h-6 animate-pulse bg-slate-200 rounded-full" />}>
                                <DarkMode />
                            </Suspense>
                            <div className={`avatar ${isOnline ? 'avatar-online' : 'avatar-offline'} select-none`}>
                                <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                                    <img src={anonim} alt='react logo' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${navBtn ? 'max-h-[100vh] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-1 pb-2 border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                            {navlink.map((data, i) => {
                                const isSubOpen = openSubIndex === i;
                                return (
                                    <div key={i} className="w-full">
                                        {data?.sublink && data.sublink.length ? (
                                            <div className="w-full">
                                                <button 
                                                    onClick={() => toggleSublink(i)} 
                                                    className="flex items-center justify-between w-full px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{data?.icon}</span>
                                                        <span>{data?.name}</span>
                                                    </div>
                                                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isSubOpen ? 'rotate-180' : 'text-slate-400'}`} />
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 pl-4 ${isSubOpen ? 'max-h-60 opacity-100 my-1' : 'max-h-0 opacity-0'}`}>
                                                    <ul className="flex flex-col gap-1 border-l-2 border-slate-200 dark:border-slate-700 pl-3 py-1">
                                                        {data.sublink.map((sub, subIndex) => (
                                                            <li key={subIndex}>
                                                                <NavLink 
                                                                    to={sub.path} 
                                                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-content shadow-md shadow-primary/20' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}`}
                                                                >
                                                                    <span className="text-lg">{sub.icon}</span>
                                                                    <span>{sub.name}</span>
                                                                </NavLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <NavLink 
                                                to={data?.path} 
                                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl transition-all ${isActive ? 'bg-primary text-primary-content shadow-md shadow-primary/20' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}`}
                                            >
                                                <span className="text-xl">{data?.icon}</span>
                                                <span>{data?.name}</span>
                                            </NavLink>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                <button 
                                    onClick={handleLogout} 
                                    className='flex items-center gap-3 w-full px-3 py-2.5 font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all'
                                >
                                    <LogOut className='text-xl'/>
                                    <span>Keluar / Log Out</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}
