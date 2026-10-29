import React, { Suspense, useState } from 'react'
import DarkMode from '../switch/DarkMode';
import { BiChevronDown, BiSolidLogOut } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import anonim from '/anonim.jpg'
import { pb } from '@/utils/pocketbase';

export default function AdminNav({
    isOnline,
    userRecord,
    role,
    navlink,
    setHoverNav,
    hoverNav,
    handleLogout
}) {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const avatarUrl = pb.files.getURL(userRecord, userRecord?.avatar)

    const navCondition = (data) => data?.name === 'Profile' || data?.name === 'Auth Logs Activity' || data?.name === 'Settings'

    const toggleSubMenu = (index) => {
        setOpenSubMenu(openSubMenu === index ? null : index);
        setHoverNav(true);
    };

    return (
        <>
            <div className="hidden md:block">
                <div className="w-full backdrop-blur-md pl-24 pr-10 py-4 fixed top-0 h-16 shadow-md z-40 flex flex-row items-center justify-between bg-white/80 dark:bg-gray-800 gap-5 duration-300">
                    <div className="mx-auto"></div>
                    <div className="">
                        <DarkMode />
                    </div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="cursor-pointer">
                            <div className={`avatar ${isOnline ? 'avatar-online' : 'avatar-offline'} select-none`}>
                                <div className="w-10 rounded-full ring-2 ring-gray-700 dark:ring-white ring-offset-base-100 ring-offset-2">
                                    {userRecord?.avatar ? (
                                        <img src={avatarUrl} alt={userRecord?.avatar} />
                                    ) : (
                                        <img src={anonim} alt='React' />
                                    )}
                                </div>
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-white dark:bg-gray-800 rounded-box z-[60] w-64 p-2 shadow-xl mt-3 border border-base-200">
                            <li className='font-bold text-black dark:text-white capitalize pointer-events-none'>
                                <p className="text-sm">Hallo, {role ? role : 'Guest'}</p>
                            </li>
                            <div className="divider my-1"></div>
                            {navlink?.map((data, i) => {
                                if (navCondition(data)) {
                                    return (
                                        <li key={i} className='font-semibold'>
                                            <NavLink to={data?.path} className={({ isActive }) => `flex flex-row items-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-200
                                                    ${isActive 
                                                        ? 'bg-white text-black border-2 border-black dark:bg-black dark:text-white dark:border-white font-bold' 
                                                        : 'text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                                                {data?.icon}
                                                <span>{data.name}</span>
                                            </NavLink>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                            <li>
                                <button onClick={handleLogout} className='hover:bg-error hover:text-error-content font-semibold flex items-center gap-3 text-red-500 mt-1'>
                                    <BiSolidLogOut className='text-xl' />
                                    <span>LogOut</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <nav 
                    onMouseEnter={() => setHoverNav(true)}
                    onMouseLeave={() => setHoverNav(false)}
                    className={`backdrop-blur-md py-5 sticky top-0 h-full shrink-0 shadow-xl z-50 flex flex-col gap-5 bg-white/90 dark:bg-gray-800 border-r border-base-200/50 transition-all duration-300 ease-in-out
                        ${hoverNav ? 'w-64 px-6' : 'w-20 px-4 items-center'}
                    `}
                >
                    <div className={`h-12 flex items-center justify-center font-bold text-xl tracking-wider ${hoverNav && 'border-none'} p-2 rounded-md border-2 text-black dark:text-white`}>
                        { role === "edmin" ? 
                            hoverNav ? "ADMIN DASHBOARD" : "AD" :
                            hoverNav ? "PETUGAS DASHBOARD" : "PD"
                        }
                    </div>

                    <div className="flex flex-col gap-2 w-full custom-navlink-container">
                        {navlink?.map((data, i) => {
                            if (navCondition(data)) return null;

                            const hasSublink = data?.sublink && data?.sublink?.length > 0;
                            const isAnyChildActive = data?.sublink?.some(sub => location.pathname === sub.path);

                            if (hasSublink) {
                                const isCurrentSubOpen = openSubMenu === i;
                                return (
                                    <div key={i} className="w-full flex flex-col">
                                        <NavLink 
                                            to={data?.path || "#"} 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleSubMenu(i);
                                            }}
                                            className={({ isActive }) => `flex flex-row items-center gap-4 font-semibold py-3 px-3 rounded-lg transition-all w-full
                                                ${(isActive || isAnyChildActive) ? 
                                                'bg-white text-black border-2 border-black shadow-md dark:bg-black dark:text-white dark:border-white' : 
                                                'hover:text-slate-700 text-black dark:hover:text-slate-300 dark:text-white'}
                                                ${!hoverNav && 'justify-center'}
                                            `}
                                        >
                                            <div className="text-xl flex-shrink-0">{data?.icon}</div>
                                            <div className={`flex items-center justify-between w-full transition-opacity duration-200 ${hoverNav ? 'opacity-100 flex' : 'hidden opacity-0'}`}>
                                                <span className="whitespace-nowrap">{data?.name}</span>
                                                <BiChevronDown className={`text-xl transition-transform duration-300 ${isCurrentSubOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                        </NavLink>

                                        <div className={`grid transition-all duration-300 ease-in-out
                                            ${(isCurrentSubOpen && hoverNav) ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}
                                        `}>
                                            <div className="overflow-hidden flex flex-col gap-1 pl-6 border-l-2 ml-5">
                                                {data.sublink.map((sub, subIndex) => (
                                                    <NavLink 
                                                        key={subIndex} 
                                                        to={sub.path} 
                                                        className={({ isActive }) => `flex items-center gap-3 py-2 px-3 rounded-md text-sm font-medium transition-all
                                                            ${isActive ? 
                                                            'bg-white text-black border-2 border-black shadow-md dark:bg-black dark:text-white dark:border-white' : 
                                                            'hover:text-slate-700 text-black dark:hover:text-slate-300 dark:text-white'}
                                                        `}
                                                    >
                                                        <span className="text-lg flex-shrink-0">{sub.icon}</span>
                                                        <span className="whitespace-nowrap">{sub.name}</span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <NavLink 
                                    key={i} 
                                    to={data?.path} 
                                    className={({ isActive }) => `flex flex-row items-center gap-4 font-semibold py-3 px-3 rounded-lg transition-all w-full
                                        ${(isActive ) ? 
                                        'bg-white text-black border-2 border-black shadow-md dark:bg-black dark:text-white dark:border-white' : 
                                        'hover:text-slate-700 text-black dark:hover:text-slate-300 dark:text-white'}
                                        ${!hoverNav && 'justify-center'}
                                    `}
                                >
                                    <div className="text-xl flex-shrink-0">{data?.icon}</div>
                                    <span className={`transition-opacity duration-200 whitespace-nowrap ${hoverNav ? 'block opacity-100' : 'hidden opacity-0'}`}>
                                        {data?.name}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    )
}
