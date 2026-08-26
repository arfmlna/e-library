import React, { Suspense } from 'react'
import DarkMode from '../switch/DarkMode';
import { NavLink } from 'react-router-dom';
import anonim from '/anonim.jpg'
import { LogOut, Settings } from 'lucide-react';
import { pb } from '@/utils/pocketbase';

export default function UserNav({
    isOnline,
    role,
    navlink,
    setHoverNav,
    hoverNav,
    handleLogout
}) {
    const info = pb.authStore.record
    const avatar = pb.files.getURL(info, info.avatar)
    const navCondition = (data) => data?.name === 'Profile' || data?.name === 'Auth Logs Activity' || data?.name === 'Downloads' || data?.name === 'Settings' || data?.name === 'Request & History Borrow Book'
    const toggleSubMenu = (index) => {
        setHoverNav(true);
    };
    return (
        <>
            <div className="hidden md:block select-none">
                <nav className={`backdrop-blur-xl bg-white/80 dark:bg-gray-800 border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-4 fixed top-0 w-full shadow-sm z-50 transition-all duration-300 ease-in-out
                    ${hoverNav ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}
                    onMouseEnter={() => setHoverNav(true)}
                    onMouseLeave={() => setHoverNav(false)}>
                    <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
                        <div className="flex-none">
                            <span className="text-xl font-black tracking-tight">
                                📚 RuangBaca
                            </span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            {navlink.map((data, i) => {
                                if (navCondition(data)) return null;
                                const isAnyChildActive = data?.sublink?.some(sub => location.pathname === sub.path);
                                return (
                                    <div key={i} className="relative">
                                        {data?.sublink && data?.sublink?.length ? (
                                            <div className="dropdown dropdown-hover dropdown-end">
                                                <div tabIndex={0} role="button" className="focus:outline-none">
                                                    <NavLink key={i} to={data?.path} 
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            toggleSubMenu(i)
                                                        }}
                                                        className={({ isActive }) => `flex flex-row items-center gap-2 text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-200
                                                        ${(isActive || isAnyChildActive) 
                                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold' 
                                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                                    >
                                                        {data?.icon}
                                                        <span>{data?.name}</span>
                                                    </NavLink>
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 w-48 mt-2 z-[60]">
                                                    <div className='flex flex-col gap-1'>
                                                        {data.sublink.map((sub, subIndex) => (
                                                            <NavLink key={subIndex} to={sub.path} 
                                                                className={({isActive}) => `flex flex-row items-center gap-2 text-sm py-2 px-3 rounded-xl transition-all duration-150
                                                                ${isActive 
                                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}>
                                                                    {sub.icon}
                                                                    <span>{sub.name}</span>
                                                            </NavLink>
                                                        ))}
                                                    </div>
                                                </ul>
                                            </div>
                                        ) : (
                                            <NavLink key={i} to={data?.path} 
                                                className={({ isActive }) => `flex flex-row items-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold' 
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                                                {data?.icon}
                                                <span>{data?.name}</span>
                                            </NavLink>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <Suspense fallback={<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
                                <DarkMode />
                            </Suspense>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="focus:outline-none transition hover:scale-105 active:scale-95">
                                    <div className={`avatar ${isOnline ? 'avatar-online' : 'avatar-offline'} cursor-pointer`}>
                                        <div className="w-10 h-10 rounded-full ring-2 ring-blue-500/20 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-md">
                                            <img src={info?.avatar ? avatar : anonim} alt={info?.name} />
                                        </div>
                                    </div>
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 w-64 mt-3 z-[60]">
                                    <div className='px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 mb-1'>
                                        <span className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase p-0">Status Anda</span>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize p-0 mt-0.5">
                                            Hallo, {role ? role : 'Guest'}
                                        </p>
                                    </div>
                                    {navlink?.map((data, i) => {
                                        if(navCondition(data)){
                                            return (
                                                <li key={i} className="my-0.5">
                                                    <NavLink to={data?.path} className="flex flex-row items-center gap-3 py-2.5 px-3 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700/50 text-sm">
                                                        <span className="text-lg opacity-80">{data?.icon}</span>
                                                        <span>{data.name}</span>
                                                    </NavLink>
                                                </li>
                                            )
                                        }
                                        return null;
                                    })}
                                    <li onClick={handleLogout} className="mt-1 border-t border-slate-100 dark:border-slate-700/50 pt-1">
                                        <button className="w-full flex flex-row items-center gap-3 py-2.5 px-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-sm text-left transition-colors">
                                            <LogOut className='text-lg' />
                                            <span>Log Out</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </nav>
                <div className="py-6 px-2 fixed left-0 right-0 top-0 z-40" 
                    onMouseEnter={() => setHoverNav(true)}
                    onMouseLeave={() => setHoverNav(false)}
                >
                </div>
            </div>
        </>
    )
}
