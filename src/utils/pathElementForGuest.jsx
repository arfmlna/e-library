import { lazy } from 'react'

const ForgotPassword = lazy(() => import('@/pages/signs/ForgotPassword'))
const Verification = lazy(() => import('@/pages/signs/Verification'))
const App = lazy(() => import('@/App.jsx')) 
const NotFound = lazy(() => import('@/NotFound'))
const SignIn = lazy(() => import('@/pages/signs/SignIn'))
const SignUp = lazy(() => import('@/pages/signs/SignUp'))
const LandingPage = lazy(() => import('@/pages/home/landingpage'))
const InformationBoard = lazy(() => import('@/pages/informationboard/InformationBoard'))
const ArticleDetail = lazy(() => import('@/pages/informationboard/ArticleDetail'))

export const pathElementForGuest = [
    { path: '*', element: NotFound },
    { path: '/', element: App },
    { path: '/sign-in', element: SignIn },
    { path: '/sign-up', element: SignUp },
    { path: '/verification', element: Verification },
    { path: '/home', element: LandingPage },
    { path: '/info-board', element: InformationBoard },
    { path: '/detail-article/:id', element: ArticleDetail },
    { path: '/forgot-password', element: ForgotPassword },
]