import React, { Fragment, lazy, useState } from 'react'
import useOnlineStatus from '../../constants/useOnlineStatus'
import Swal from 'sweetalert2'
import { pb } from '../../utils/pocketbase'
import { UserKey } from 'lucide-react'

const GuestNav = lazy(() => import('./guestnav'))
const Mobile = lazy(() => import('./mobile'))
const AdminNavigation = lazy(() => import('./admnav'))
const UserNavigation = lazy(() => import('./usrnav'))

export default function Navbar({role, navlink}) {
    const [navBtn, setNavBtn] = useState(false)
    const [hoverNav, setHoverNav] = useState(false)
    const [openSubIndex, setOpenSubIndex] = useState(null);

    const toggleSublink = (index) => {
        setOpenSubIndex(openSubIndex === index ? null : index);
    };

    const isOnline = useOnlineStatus()

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
                window.location.href = "/sign-in"
            }
        })
    }

    if (location?.pathname === 'sign-in' || location?.pathname === '/sign-up') {
        return
    }

    return (
        <>
            { !role && (
                <GuestNav
                navlink={navlink}
                />
            )}
            { role && (
                <Fragment>
                    <Mobile 
                    navBtn={navBtn}
                    setNavBtn={setNavBtn}
                    openSubIndex={openSubIndex}
                    toggleSublink={toggleSublink}
                    isOnline={isOnline}
                    navlink={navlink}
                    handleLogout={handleLogout}
                    />
                    { role === "users" ? (
                    <UserNavigation
                        hoverNav={hoverNav}
                        isOnline={isOnline}
                        navlink={navlink}
                        role={role}
                        setHoverNav={setHoverNav}
                        handleLogout={handleLogout}
                    />
                    ) : (
                    <AdminNavigation
                        hoverNav={hoverNav}
                        isOnline={isOnline}
                        navlink={navlink}
                        role={role}
                        setHoverNav={setHoverNav}
                        userRecord={UserKey}
                        handleLogout={handleLogout}
                    />
                    )}
                </Fragment>
            )}
        </>
    )
}
