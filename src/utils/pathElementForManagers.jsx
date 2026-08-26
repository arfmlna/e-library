import { lazy } from 'react'

const LibrarySystem = lazy(() => import('@/pages/librarysystem/LibrarySystem'))
const ControlStudents = lazy(() => import('@/pages/manage/ControlStudents'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard.jsx')) 
const Downloads = lazy(() => import('@/pages/download/Downloads.jsx')) 
const Books = lazy(() => import('@/pages/books/Books.jsx')) 
const BooksId = lazy(() => import('@/pages/books/BooksId.jsx')) 
const Profile = lazy(() => import('@/pages/profile/Profile.jsx')) 
const DownloadsId = lazy(() => import('@/pages/download/DownloadsId.jsx'))
const NotFound = lazy(() => import('@/NotFound'))
const BooksControl = lazy(() => import('@/pages/ebooks/book/BooksControl'))
const BorrowBook = lazy(() => import('@/pages/borrowbook/BorrowBook'))
const ReturnBook = lazy(() => import('@/pages/returnbook/ReturnBook'))
const ArticleDetail = lazy(() => import('@/pages/informationboard/ArticleDetail'))
const ArticlesControls = lazy(() => import('@/pages/articlescontrols/ArticlesControls'))
const Reader = lazy(() => import('@/components/bookReader/Reader'))
const LoanReport = lazy(() => import('@/pages/loanreport/LoanReport'))
const OverdueReportManager = lazy(() => import('@/pages/overduereport/OverdueReportManager'))
const GenreReport = lazy(() => import('@/pages/genrereport/GenreReport'))
const TopBooksReport = lazy(() => import('@/pages/topbooksreport/TopBooksReport'))
const TopMembersReport = lazy(() => import('@/pages/topmembersreport/TopMembersReport'))
const Agendas = lazy(() => import('@/pages/agendas/Agendas'))
const BookListRequest = lazy(() => import('@/pages/pengajuan/BookListRequest'))

export const pathElementForManagers = [
    { path: '*', element: NotFound },
    { path: '/profile', element: Profile },
    
    { path: '/downloads', element: Downloads },
    { path: '/downloads/:downloadId', element: DownloadsId },
    { path: '/books', element: Books },
    { path: '/books/:bookId', element: BooksId },
    { path: '/reader/online/:id', element: Reader },

    { path: '/dashboard', element: Dashboard },
    { path: '/list-siswa', element: ControlStudents },
    { path: '/e-books', element: BooksControl },
    { path: '/borrow', element: BorrowBook },
    { path: '/return', element: ReturnBook },
    { path: '/lib-system', element: LibrarySystem },
    { path: '/article-controls', element: ArticlesControls },
    { path: '/detail-article/:id', element: ArticleDetail },
    { path: '/loan-report', element: LoanReport },
    { path: '/overdue-report', element: OverdueReportManager },
    { path: '/top-book', element: TopBooksReport },
    { path: '/top-member', element: TopMembersReport },
    { path: '/genre-report', element: GenreReport },
    { path: '/lib-agendas', element: Agendas },
    { path: '/article-controls', element: ArticlesControls },
    { path: '/detail-article/:id', element: ArticleDetail },
    { path: '/request-book', element: BookListRequest },
]