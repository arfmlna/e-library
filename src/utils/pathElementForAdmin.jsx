import Test from '@/pages/test/Test'
import { lazy } from 'react'

const AdminVerificationPage = lazy(() => import('@/pages/pengajuanaccount/AdminVerificationPage'))
const AuthActivityLogs = lazy(() => import('@/pages/authactivity/AuthActivityLogs'))
const AdmSettings = lazy(() => import('@/pages/settings/AdmSettings'))
// const UsersSettings = lazy(() => import('@/pages/settings/UsersSettings'))
const Agendas = lazy(() => import('@/pages/agendas/Agendas'))
const ArticlesControls = lazy(() => import('@/pages/articlescontrols/ArticlesControls'))
const Supplier = lazy(() => import('@/pages/ebooks/supplier/Supplier'))
const GenreReport = lazy(() => import('@/pages/genrereport/GenreReport'))
const TopBooksReport = lazy(() => import('@/pages/topbooksreport/TopBooksReport'))
const TopMembersReport = lazy(() => import('@/pages/topmembersreport/TopMembersReport'))
const LoanReport = lazy(() => import('@/pages/loanreport/LoanReport'))
const OverdueReportManager = lazy(() => import('@/pages/overduereport/OverdueReportManager'))
const LibrarySystem = lazy(() => import('@/pages/librarysystem/LibrarySystem'))
const Categories = lazy(() => import('@/pages/category/Categories'))
const CategoryId = lazy(() => import('@/pages/category/CategoryId'))
const Category = lazy(() => import('@/pages/ebooks/category/Category'))
const ControlAll = lazy(() => import('@/pages/manage/ControlAll'))
const ControlManagers = lazy(() => import('@/pages/manage/ControlManagers'))
const ControlStudents = lazy(() => import('@/pages/manage/ControlStudents'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard.jsx')) 
const Downloads = lazy(() => import('@/pages/download/Downloads.jsx')) 
const Books = lazy(() => import('@/pages/books/Books.jsx')) 
const BooksId = lazy(() => import('@/pages/books/BooksId.jsx')) 
const Profile = lazy(() => import('@/pages/profile/Profile.jsx')) 
const DownloadsId = lazy(() => import('@/pages/download/DownloadsId.jsx'))
const NotFound = lazy(() => import('@/NotFound'))
const BooksControl = lazy(() => import('@/pages/ebooks/book/BooksControl'))
const ArticleDetail = lazy(() => import('@/pages/informationboard/ArticleDetail'))
const Reader = lazy(() => import('@/components/bookReader/Reader'))
const BookListRequest = lazy(() => import('@/pages/pengajuan/BookListRequest'))

export const pathElementForAdmin = [
    { path: '*', element: NotFound },
    { path: '/profile', element: Profile },
    { path: '/auth-logs', element: AuthActivityLogs },

    { path: '/downloads', element: Downloads },
    { path: '/downloads/:downloadId', element: DownloadsId },
    { path: '/books', element: Books },
    { path: '/books/:bookId', element: BooksId },
    { path: '/category/', element: Categories },
    { path: '/category/:categoryName', element: CategoryId },

    { path: '/dashboard', element: Dashboard },
    { path: '/list-siswa', element: ControlStudents },
    { path: '/list-petugas', element: ControlManagers },
    { path: '/kategori', element: Category },
    { path: '/list-all', element: ControlAll },
    { path: '/e-books', element: BooksControl },
    { path: '/lib-system', element: LibrarySystem },
    { path: '/loan-report', element: LoanReport },
    { path: '/overdue-report', element: OverdueReportManager },
    { path: '/top-book', element: TopBooksReport },
    { path: '/top-member', element: TopMembersReport },
    { path: '/genre-report', element: GenreReport },
    { path: '/supplier', element: Supplier },
    { path: '/lib-agendas', element: Agendas },
    { path: '/article-controls', element: ArticlesControls },
    { path: '/detail-article/:id', element: ArticleDetail },
    { path: '/reader/online/:id', element: Reader },
    { path: '/request-book', element: BookListRequest },
    { path: '/user-verification', element: AdminVerificationPage },
    { path: '/setting', element: AdmSettings },
    // { path: '/setting', element: UsersSettings },

    { path: '/test', element: Test },
]