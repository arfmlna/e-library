/* eslint-disable react-refresh/only-export-components */
import { StrictMode, Suspense, lazy, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { pb } from './utils/pocketbase'
import { elementForEdmin, elementForGuest, elementForManager, elementForUser } from './utils/ListContent'
import { navlink } from './utils/ListContent'
import { Music } from 'lucide-react'
import { useLocalStorage } from './constants/useLocalStorage'
import { ConfigProvider } from './constants/configProvider'

const MusicPlayer = lazy(() => import('./components/music/MusicPlayer'))
const NotFound = lazy(() => import('./NotFound'))
const PWABadge = lazy(() => import('./PWABadge'))
const Navbar = lazy(() => import('./components/navbar/navbar.jsx')) 
const Theme = lazy(() => import('./components/theme/Theme.jsx')) 

const queryClient = new QueryClient()
const rule = pb?.authStore?.record?.role
const isRule = rule ? rule : 'guest'

const getFilteredMenu = (menuList, userRole) => {
  return menuList
    .filter(item => item.roles.includes(userRole))
    .map(item => {
      if (item.sublink) {
        return {
          ...item,
          sublink: item.sublink.filter(sub => sub.roles.includes(userRole))
        };
      }
      return item;
    });
};

const BaseLayout = ({ navlink }) => {
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)

  const role = pb.authStore.record?.role
  const location = useLocation()
  const [showMP] = useLocalStorage('showMP', true)

  const isAuthPage = [
    '/sign-in', 
    '/sign-up', 
    '/verification', 
    '/not-found',
    '/forgot-password'
  ].includes(location.pathname) 
  || /^\/flipbook\/online\/[^/]+/.test(location.pathname)
  || /^\/flipbook\/offline\/[^/]+/.test(location.pathname)
  || /^\/reader\/online\/[^/]+/.test(location.pathname)
  || /^\/reader\/offline\/[^/]+/.test(location.pathname)

  return (
    <div className={`flex ${!role || role === 'users' ? 'flex-col' : 'flex-row'} min-h-screen w-full bg-base-100 text-base-content overflow-x-hidden`}>
      { !isAuthPage && <Navbar role={role} navlink={navlink} /> }
      <div className="flex flex-col flex-1 min-w-0">
        {!isAuthPage && <div className="h-16 w-full shrink-0 mt-5" />}
          <main>
              <Outlet /> 
          </main>
      </div>

      {(showMP && !showMusicPlayer) && (
        <button 
          onClick={() => setShowMusicPlayer(true)}
          className="fixed bottom-6 right-6 z-40 btn btn-circle btn-primary btn-lg shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <Music size={24} />
        </button>
      )}

      <MusicPlayer 
        isOpen={showMusicPlayer} 
        onClose={() => setShowMusicPlayer(false)} 
      />
      
      <Suspense fallback={null}>
        <PWABadge />
      </Suspense>
    </div>
  )
}

const allowedMenu = getFilteredMenu(navlink, isRule);

const LayoutAll = () => {
  return <BaseLayout navlink={allowedMenu} />
};

const LoadingFull = () => (
  <div className='min-h-screen w-full flex justify-center items-center'>
    <p className='text-center font-bold text-4xl'>Loading...</p>
  </div>
);

const ProtectedRoute = () => {
  const isValid = pb?.authStore?.isValid;
  const record = pb?.authStore?.record;

  if (!isValid) {
    return <Navigate to="/home" replace />;
  }

  // if (record?.role === 'users' && (record?.status !== 'verified')) {
  //   if (window.location.pathname !== '/verification') {
  //     return <Navigate to="/verification" replace />;
  //   }
  // }
  return <Outlet />;
};

const renderLayout = (layout, content) => {
  return (
    <Route element={layout}>
      { content?.map((items, i) => {
        const ComponentElement = items.element; 
        return(
        <Route key={i} path={items.path} element={
            <ComponentElement />
        } />
        )
      }
      ) }
    </Route>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFull />}>
          <ConfigProvider>
            <Theme>
              <Routes>
                {/* 1. LOGIKA PENGALIHAN UTAMA DI PATH AKAR */}
                <Route path="/" element={
                  !pb?.authStore?.isValid ? ( 
                    <Navigate to="/home" replace />
                  ) : pb.authStore.record?.role === 'users' ? ( 
                    // (pb.authStore.record?.status !== 'verified') ? (
                    //   <Navigate to="/verification" replace />
                    // ) : 
                    // (
                      <Navigate to="/downloads" replace /> 
                    // )
                  ) : pb.authStore.record?.role === 'petugas' || pb.authStore.record?.role === 'edmin' ? ( 
                    <Navigate to="/dashboard" replace /> 
                  ) : ( 
                    <Navigate to="/home" replace /> 
                  )
                }/>

                {/* 2. RUTE UNTUK GUEST / BELUM LOGIN */}
                {!pb?.authStore?.isValid && renderLayout(<LayoutAll />, elementForGuest)}

                {/* 3. RUTE UNTUK EDMIN */}
                {pb?.authStore?.isValid && pb?.authStore?.record?.role === 'edmin' && (
                  <Route element={<ProtectedRoute />}>
                    {renderLayout(<LayoutAll />, elementForEdmin)}
                  </Route>
                )}

                {/* 4. RUTE UNTUK PETUGAS (MANAGER) */}
                {pb?.authStore?.isValid && pb?.authStore?.record?.role === 'petugas' && (
                  <Route element={<ProtectedRoute />}>
                    {renderLayout(<LayoutAll />, elementForManager)}
                  </Route>
                )}

                {/* 5. RUTE UNTUK USERS */}
                {pb?.authStore?.isValid && pb?.authStore?.record?.role === 'users' && (
                  <Route element={<ProtectedRoute />}>
                    {renderLayout(<LayoutAll />, elementForUser)}
                  </Route>
                )}

                {/* 6. FALLBACK 404 NOT FOUND */}
                <Route path="*" element={<NotFound code={'404'} text={'Not Found'} />} />
              </Routes>
            </Theme>
          </ConfigProvider>
        </Suspense>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
  ,
)
