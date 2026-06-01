import { StrictMode, Suspense, lazy, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Outlet, replace, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from './constants/globals.jsx' 
import { pb } from './utils/pocketbase'
import { HiHomeModern } from 'react-icons/hi2'
import { FaCloudUploadAlt, FaSwatchbook } from 'react-icons/fa'
import { RiGalleryFill, RiProfileFill } from 'react-icons/ri'
import { elementForEdmin, elementForGuest, elementForManager, elementForUser } from './utils/ListContent'
import { FaAddressCard, FaPeopleGroup, FaUserGroup, FaUsersLine } from 'react-icons/fa6'
import { BiCategory } from 'react-icons/bi'

const SignIn = lazy(() => import('./pages/signs/SignIn'))
const NotFound = lazy(() => import('./NotFound'))
const SignUp = lazy(() => import('./pages/signs/SignUp'))
const PWABadge = lazy(() => import('./PWABadge'))
const Navbar = lazy(() => import('./components/navbar/navbar.jsx')) 
const Theme = lazy(() => import('./components/theme/Theme.jsx')) 

const queryClient = new QueryClient()

const BaseLayout = ({ children, navlink }) => (
    <div>
      <Suspense fallback={<LoadingFull />}>
        <Navbar role={pb.authStore.record?.role} navlink={navlink} />
      </Suspense>
      
      <Outlet />
      
      <Suspense fallback={null}>
        <PWABadge />
        <CheckStorage />
      </Suspense>
    </div>
)

const LoadingFull = () => (
  <div className='min-h-screen w-full flex justify-center items-center'>
    <p className='text-center font-bold text-4xl'>Loading...</p>
  </div>
);

const CheckStorage = () => {
  const [storage, setStorage] = useState({ quota: 0, usage: 0 });
  const [status, setStatus] = useState(true);
  
  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah memory leak

    const checkStorage = async () => {
      try {
        if (navigator.storage && navigator.storage.estimate) {
          // Pilih salah satu: gunakan await SAJA, jangan dicampur .then()
          const estimate = await navigator.storage.estimate();
          const quota = (estimate.quota / (1024 ** 3)).toFixed(2);
          const usage = (estimate.usage / (1024 ** 3)).toFixed(2);
          
          if (isMounted) {
            setStorage({ quota, usage });
          }
        }
      } catch (err) {
        console.error("Gagal memeriksa penyimpanan:", err);
      }
    };
  
    checkStorage();
    return () => { isMounted = false; }; // Bersihkan saat komponen unmount
  }, []); // Array kosong memastikan HANYA jalan 1 kali di awal
  
  if (!status) return null;
  
  return (
    <div className={`left-3 bottom-3 bg-black/90 text-white p-2 rounded-md text-xs italic ${ status === true ? 'fixed' : 'hidden' }`}
      onClick={() => setStatus(false)}
    >
      <table>
        <tbody>
          <tr>
            <td className='pr-5'>Sisa Kuota</td>
            <td>: {storage.quota} GB</td>
          </tr>
          <tr>
            <td className='pr-5'>Terpakai</td>
            <td>: {storage.usage} GB</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const LayoutForEdmin = () => {
  const navlink = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <HiHomeModern className='text-2xl pr-1' />
    },{
      name: "Manage",
      path: "/manage",
      icon: <FaUserGroup className='text-2xl pr-1' />,
      sublink: [
        { name: "Semua", path: "/list-all", icon: <FaUsersLine className='text-2xl pr-1' /> },
        { name: "Petugas", path: "/list-petugas", icon: <FaPeopleGroup className='text-2xl pr-1' /> },
        { name: "Peserta Didik", path: "/list-siswa", icon: <FaAddressCard className='text-2xl pr-1' /> },
      ]
    },{
      name: "E-Books",
      path: "/manage-books",
      icon: <FaUserGroup className='text-2xl pr-1' />,
      sublink: [
        { name: "Katalog", path: "/katalog", icon: <FaUsersLine className='text-2xl pr-1' /> },
        { name: "E-Books", path: "/e-books", icon: <FaCloudUploadAlt className='text-2xl pr-1' /> },
        { name: "Kategori", path: "/kategori", icon: <FaAddressCard className='text-2xl pr-1' /> },
      ]
    },{
      name: "Profile",
      path: "/profile",
      icon: <RiProfileFill className='text-2xl pr-1' />
    }
  ]

  return <BaseLayout navlink={navlink} />
};

const LayoutForManager = () => {
  const navlink = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <HiHomeModern className='text-2xl pr-1' />
    },{
      name: "Manage",
      path: "/manage",
      icon: <FaUserGroup className='text-2xl pr-1' />,
      sublink: [
        { name: "Peserta Didik", path: "/list-siswa", icon: <FaAddressCard className='text-2xl pr-1' /> },
      ]
    },{
      name: "E-Books",
      path: "/manage-books",
      icon: <FaUserGroup className='text-2xl pr-1' />,
      sublink: [
        { name: "Katalog", path: "/katalog", icon: <FaUsersLine className='text-2xl pr-1' /> },
        { name: "E-Books", path: "/e-books", icon: <FaCloudUploadAlt className='text-2xl pr-1' /> },
        { name: "Kategori", path: "/kategori", icon: <FaAddressCard className='text-2xl pr-1' /> },
      ]
    },{
        name: "Profile",
        path: "/profile",
        icon: <RiProfileFill className='text-2xl pr-1' />
    }
  ]

  return <BaseLayout navlink={navlink} />;
};

const LayoutForUser = () => {
  const navlink = [
    {
      name: "Books",
      path: "/books",
      icon: <FaSwatchbook className='text-2xl pr-1' />
    }, {
      name: "Downloads",
      path: "/downloads",
      icon: <RiGalleryFill className='text-2xl pr-1' />
    }, {
      name: "Category",
      path: "/category",
      icon: <BiCategory className='text-2xl pr-1' />
    }, {
      name: "Profile",
      path: "/profile",
      icon: <RiProfileFill className='text-2xl pr-1' />
    },
  ]

  return <BaseLayout navlink={navlink} />
};

const LayoutForGuest = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

const ProtectedRoute = () => {
  const isValid = pb?.authStore?.isValid;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingFull />;
  if (!isValid) return <Navigate to="/sign-in" replace />;

  return <Outlet />;
};

const renderLayout = (layout, content) => {
  return (
    <Route element={layout}>
      { content?.map((items, i) => {
        const ComponentElement = items.element; 
        return(
        <Route key={i} path={items.path} element={
          <Suspense fallback={<LoadingFull />}>
            <ComponentElement />
          </Suspense>
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
        <Suspense fallback={
          <div className='min-h-screen w-full flex justify-center items-center'>
            <p className='text-center font-bold text-4xl'>Loading...</p>
          </div>
        }>
          <ConfigProvider>
            <Theme>
              <Routes>
                {/* guest */}
                <Route element={<LayoutForGuest />}>
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                </Route>
                <Route path="/" element={
                  !pb?.authStore?.isValid ? (
                    <Navigate to="/sign-in" replace />
                  ) : pb.authStore.record?.role === 'users' ? (
                    <Navigate to="/downloads" replace />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                } 
              />
                {/* Rute Khusus Admin (Edmin) */}
                {pb?.authStore?.isValid && pb?.authStore?.record?.role === 'edmin' && (
                  <Route element={<ProtectedRoute />}>
                    {renderLayout(<LayoutForEdmin />, elementForEdmin)}
                  </Route>
                )}

                {/* Rute Khusus Petugas */}
                {pb?.authStore?.isValid && pb?.authStore?.record?.role === 'petugas' && (
                  <Route element={<ProtectedRoute />}>
                    {renderLayout(<LayoutForManager />, elementForManager)}
                  </Route>
                )}

                {/* Rute Khusus Users */}
                {pb?.authStore?.isValid && pb?.authStore?.record?.role === 'users' && (
                  <Route element={<ProtectedRoute />}>
                    {renderLayout(<LayoutForUser />, elementForUser)}
                  </Route>
                )}
                {/* <Route path="/unauthorize" element={<NotFound code={'403'} text={'Akses ditolak'}/>} /> */}
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
