import React, { lazy, Suspense, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import reactLogo from '../../assets/react.svg'
import useOnlineStatus from '../../constants/useOnlineStatus'
import Swal from 'sweetalert2'
import { FaXmark } from 'react-icons/fa6'
import { BiSolidLogOut } from 'react-icons/bi'
import { pb } from '../../utils/pocketbase'
import FallenPetals from '/FallenPetals_Fleet Snowfluff.mp3'

const DarkMode = lazy(() => import('../switch/DarkMode')) 
const Music = lazy(() => import('../music/Music')) 

export default function Navbar({role, navlink}) {
    const [navBtn, setNavBtn] = useState(false)
    const [hoverNav, setHoverNav] = useState(false)
    const [dropNavLink, setDropNavLink] = useState(false)

    const audioRef = useRef(null)
    const isOnline = useOnlineStatus()
    const navigate = useNavigate()

    const userRecord = pb.authStore.record; 
    const getAvatar = userRecord?.avatar 
        ? `${pb.baseURL}/api/files/_pb_users_auth_/${userRecord.id}/${userRecord.avatar}`
        : '/default-avatar.png';

    const handleLogout = () => {
        Swal.fire({
            title: "Info Logout🚪",
            text: "Yakin Ingin Keluar?",
            icon: "question",
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "Ya!",
            denyButtonText: "Tidak!"
        }).then((res) => {
            if (res.isConfirmed) {
                pb.authStore.clear()
                navigate('/')
            }
        })
    }

    return (
        <>
            {/* mobile */}
            <div className="block md:hidden">
                <div className='w-full fixed z-50 backdrop-blur-md'>
                    <nav className='px-2 py-4 w-full shadow-lg'>
                        <div className="flex flex-row items-center gap-3">
                            <div className="">
                                <div className={`avatar ${isOnline ? 'avatar-online' : 'avatar-offline'} select-none`}>
                                    <div className="w-8 rounded-full ring-2">
                                        <img src={reactLogo} alt='react' />
                                    </div>
                                </div>
                            </div>
                            <Suspense fallback={<p>Loading...</p>}>
                                <DarkMode />
                            </Suspense>
                            <Suspense fallback={<p>Loading...</p>}>
                                <Music audioRef={audioRef} />
                            </Suspense>
                        <div className="mx-auto"></div>
                        <button onClick={() => setNavBtn(!navBtn)}>
                            <FaXmark className={`text-3xl ${navBtn ? 'rotate-90' : 'rotate-0'} transition-all ease-in-out duration-500`} />
                        </button>
                        </div>
                        <div className={`${navBtn ? 'flex' : 'hidden'} flex-col gap-1 py-2 transition-all ease-in-out duration-1000`}>
                            { navlink.map((data, i) => (
                                <div key={i}>
                                    { data?.sublink && data.sublink.length ? (
                                        <div className="">
                                            <div className="" onClick={() => setDropNavLink(!dropNavLink)}>
                                                <div key={i} to={data?.path} className='flex flex-row font-bold pr-1'>
                                                    { data?.icon }
                                                    <p>
                                                        { data?.name }
                                                    </p>
                                                </div>
                                            </div>
                                            <ul className={`rounded-box backdrop-blur-md p-2 shadow-md transition-all ease-in-out duration-500 ${dropNavLink ? 'block' : 'hidden'}`}>
                                                {data.sublink.map((sub, subIndex) => (
                                                <li key={subIndex} className='pr-1 flex flex-row'>
                                                    <div className="">
                                                        { sub.icon }
                                                    </div>
                                                    <NavLink to={sub.path} className="font-bold">{sub.name}</NavLink>
                                                </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <NavLink key={i} to={data?.path} className='flex flex-row font-bold pr-1'>
                                            { data?.icon }
                                            <p>
                                                { data?.name }
                                            </p>
                                        </NavLink>
                                    )}
                                </div>
                            )) }
                            <ul className='flex flex-col gap-1'>
                                <li onClick={handleLogout} className='hover:bg-red-600 hover:rounded hover:text-white font-bold pr-1 flex flex-row'>
                                    <BiSolidLogOut className='text-2xl pr-1'/>
                                    <a>LogOut</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            {/* desktop */}
            <div className="hidden md:block">
                <nav className={`backdrop-blur-md px-10 py-5 fixed top-0 w-full shadow-lg z-50 
                    ${hoverNav ? 'translate-y-0' : '-translate-y-20'} transition ease-in-out duration-300`}
                    onMouseEnter={() => setHoverNav(true)}
                    onMouseLeave={() => setHoverNav(false)}>
                    <div className="flex flex-row gap-5 items-center">
                        { navlink.map((data, i) => {
                            if (data?.name !== 'Profile') {
                                return (
                                <div key={i}>
                                    { data?.sublink && data?.sublink?.length ? (
                                        <div className="dropdown">
                                            <div tabIndex={0} role="button" className="">
                                                <NavLink key={i} to={data?.path} className='flex flex-row font-bold'>
                                                    { data?.icon }
                                                    <p>
                                                        { data?.name }
                                                    </p>
                                                </NavLink>
                                            </div>
                                            <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-44 p-2 shadow-sm top-14">
                                                {data.sublink.map((sub, subIndex) => (
                                                <li key={subIndex} className='flex flex-row'>
                                                    <div className="">
                                                        { sub.icon }
                                                        <NavLink to={sub.path}>{sub.name}</NavLink>
                                                    </div>
                                                </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <NavLink key={i} to={data?.path} className='flex flex-row font-bold'>
                                            { data?.icon }
                                            <p>
                                                { data?.name }
                                            </p>
                                        </NavLink>
                                    )}
                                </div>
                                )
                            }
                        })}
                        <div className="mx-auto"></div>
                        <Suspense fallback={<p>Loading...</p>}>
                            <DarkMode />
                        </Suspense>
                        <Suspense fallback={<p>Loading...</p>}>
                            <Music audioRef={audioRef} />
                        </Suspense>
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="">
                                <div className={`avatar ${isOnline ? 'avatar-online' : 'avatar-offline'} select-none`}>
                                    <div className="w-10 rounded-full ring-2">
                                        { userRecord?.avatar ? (
                                            // <img src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${getAvatar.record.collectionId}/${getAvatar.record.id}/${getAvatar.record.avatar}`} alt={getAvatar.record.name} />
                                            <img src={getAvatar} alt={userRecord?.avatar} />
                                        ) : (
                                            <img src={reactLogo} alt='React' />
                                        ) }
                                    </div>
                                </div>
                            </div>
                            <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-64 p-2 shadow-sm top-14 -right-9">
                                <li className='font-bold text-black dark:text-white capitalize'>
                                    <p>
                                        Hallo, { role ? role : 'Guest' }
                                    </p>
                                </li>
                                { navlink?.map((data, i) => {
                                    if(data?.name === 'Profile'){
                                        return (
                                        <li key={i} className='font-bold'>
                                            <div className="flex flex-row">
                                                { data?.icon }
                                                <NavLink to={data?.path}>{data.name}</NavLink>
                                            </div>
                                        </li>
                                        )
                                    }
                                }) }
                                <li onClick={handleLogout} className='hover:bg-red-600 hover:rounded hover:text-white font-bold flex flex-row'>
                                    <div className="flex flex-row">
                                        <BiSolidLogOut className='text-2xl pr-1' />
                                        <a>LogOut</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="py-8 px-2 fixed left-0 right-0" 
                    onMouseEnter={() => setHoverNav(true)}
                    onMouseLeave={() => setHoverNav(false)}
                >
                </div>
            </div>
            <audio ref={audioRef} src={FallenPetals}></audio>
        </>
    )
}
