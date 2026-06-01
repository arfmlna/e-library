import { lazy } from 'react'

const Categories = lazy(() => import('@/pages/category/Categories'))
const CategoryId = lazy(() => import('@/pages/category/CategoryId'))
const Category = lazy(() => import('@/pages/ebooks/category/Category'))
const ControlAll = lazy(() => import('@/pages/manage/ControlAll'))
const ControlManagers = lazy(() => import('@/pages/manage/ControlManagers'))
const ControlStudents = lazy(() => import('@/pages/manage/ControlStudents'))
const Reader = lazy(() => import('@/components/bookReader/Reader'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard.jsx')) 
const Downloads = lazy(() => import('@/pages/download/Downloads.jsx')) 
const Books = lazy(() => import('@/pages/books/Books.jsx')) 
const BooksId = lazy(() => import('@/pages/books/BooksId.jsx')) 
const Profile = lazy(() => import('@/pages/profile/Profile.jsx')) 
const DownloadsId = lazy(() => import('@/pages/download/DownloadsId.jsx'))
const App = lazy(() => import('@/App.jsx')) 
const NotFound = lazy(() => import('@/NotFound'))
const SignIn = lazy(() => import('@/pages/signs/SignIn'))
const SignUp = lazy(() => import('@/pages/signs/SignUp'))
const BooksControl = lazy(() => import('@/pages/ebooks/book/BooksControl'))

// Guest
export const elementForGuest = [
  { path: '*', element: NotFound },
  { path: '/', element: App },
  { path: '/sign-in', element: SignIn },
  { path: '/sign-up', element: SignUp },
]

// login users
export const elementForUser = [
  { path: '*', element: NotFound },
  { path: '/profile', element: Profile },
  { path: '/downloads', element: Downloads },
  { path: '/downloads/:downloadId', element: DownloadsId },
  { path: '/books', element: Books },
  { path: '/books/:bookId', element: BooksId },
  { path: '/reader/:bookId', element: Reader },
  { path: '/category/', element: Categories },
  { path: '/category/:categoryName/:categoryId', element: CategoryId },
]

export const elementForManager = [
  { path: '*', element: NotFound },
  { path: '/profile', element: Profile },
  { path: '/dashboard', element: Dashboard },
  { path: '/list-siswa', element: ControlStudents },
  { path: '/kategori', element: Category },
  { path: '/e-books', element: BooksControl },
]

export const elementForEdmin = [
  { path: '*', element: NotFound },
  { path: '/profile', element: Profile },
  { path: '/dashboard', element: Dashboard },
  { path: '/list-siswa', element: ControlStudents },
  { path: '/list-petugas', element: ControlManagers },
  { path: '/kategori', element: Category },
  { path: '/list-all', element: ControlAll },
  { path: '/e-books', element: BooksControl },
]