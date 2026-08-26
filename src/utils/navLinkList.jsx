import { 
    Asterisk,
    Binary,
    Book, BookDown, BookHeart, BookType, BookUp, 
    BookUser, 
    Calendars, 
    ChartBarStacked, ChartColumnStacked, ChartNoAxesCombined, CircleSmall, Clipboard, ClipboardClock, Compass, Flame, GitPullRequest, Glasses, GraduationCap, HandHeart, Home, HomeIcon, 
    Info, Landmark, LibraryBig, ListStart, Logs, MonitorDown, Newspaper, NotepadTextDashed, RedoDot, RefreshCcwDot, 
    Settings,  
    SquareLibrary, 
    TableOfContents, 
    Telescope, 
    User, 
    UserCog, 
    UserPen,
    Users} from 'lucide-react'

export const navLinkList = [
    // dashboard
    {
        name: "Home",
        path: "/dashboard",
        icon: <Home className='pr-1' />,
        roles: ["edmin", "petugas"]
    },
    // landing page
    {
        name: "Home",
        path: "/home/#home",
        icon: <HomeIcon className='pr-1' />,
        roles: ["users", "guest"]
    },
    // information board
    {
        name: "About We",
        path: "/home/#about",
        icon: <Info className='pr-1' />,
        roles: ["guest"]
    },
    {
        name: "Feature",
        path: "/home/#feature",
        icon: <Info className='pr-1' />,
        roles: ["guest"]
    },
    {
        name: "Discovery",
        path: "/discovery",
        icon: <Compass className='pr-1' />,
        roles: ["users"],
        sublink: [
            { name: "Discovery", path: "/discovery", icon: <Telescope className='pr-1' />, roles: ["users"] },
            { name: "Top Borrowed Books", path: "/top-digital-book", icon: <Binary className='pr-1' />, roles: ["users"] },
            { name: "Trending Digital Book", path: "/top-borrow-book", icon: <HandHeart className='pr-1' />, roles: ["users"] },
            { name: "Top Readers", path: "/top-users-list", icon: <Glasses className='pr-1' />, roles: ["users"] },
        ]
    },
    {
        name: "Information Board",
        path: "/info-board",
        icon: <Info className='pr-1' />,
        roles: ["users", "guest"]
    },
    // manage users
    {
        name: "Manage",
        path: "/manage",
        icon: <Users className='pr-1' />,
        roles: ["edmin", "petugas"],
        sublink: [
            { name: "Semua", path: "/list-all", icon: <BookUser className='pr-1' />, roles: ["edmin"] },
            { name: "Petugas", path: "/list-petugas", icon: <UserCog className='pr-1' />, roles: ["edmin"] },
            { name: "Peserta Didik", path: "/list-siswa", icon: <User className='pr-1' />, roles: ["edmin", "petugas"] },
        ]
    },
    // upload book
    {
        name: "E-Books",
        path: "/manage-books",
        icon: <LibraryBig className='pr-1' />,
        roles: ["edmin", "petugas"],
        sublink: [
        { name: "E-Books", path: "/e-books", icon: <Book className='pr-1' />, roles: ["edmin", "petugas"] },
        { name: "Kategori", path: "/kategori", icon: <ChartColumnStacked className='pr-1' />, roles: ["edmin"] },
        { name: "Supplier", path: "/supplier", icon: <ChartColumnStacked className='pr-1' />, roles: ["edmin"] },
        ]
    },
    // view books
    {
        name: "Collections",
        path: "/collections",
        icon: <BookType className='pr-1' />,
        roles: ["users"],
        sublink: [
            { name: "All Books", path: "/all-books", icon: <Landmark className='pr-1 stroke-3' />, roles: ["users"] },
            { name: "E-Books", path: "/books", icon: <NotepadTextDashed className='pr-1' />, roles: ["users"] },
            { name: "Academic Books", path: "/academic-books", icon: <GraduationCap className='pr-1 stroke-3' />, roles: ["users"] },
            { name: "Non Academic Books", path: "/nonacademic-books", icon: <BookHeart className='pr-1 stroke-3' />, roles: ["users"] },
        ]
    },
    // view category of books
    {
        name: "Category",
        path: "/category",
        icon: <ChartBarStacked className='pr-1' />,
        roles: ["users"]
    },
    // sirkulasi e-library
    {
        name: "Sirkulasi",
        path: "/manage",
        icon: <RefreshCcwDot className='pr-1' />,
        roles: ["edmin", "petugas"],
        sublink: [
            { name: "Pengajuan", path: "/request-book", icon: <GitPullRequest className='pr-1' />, roles: ["edmin", "petugas"] },
        ]
    },
    {
        name: "Request & History Borrow Book",
        path: "/request-history-borrow-book",
        icon: <ClipboardClock className='text-2xl pr-1' />,
        roles: ["users"]
    },
    // view downloaded books
    {
        name: "Downloads",
        path: "/downloads",
        icon: <MonitorDown className='pr-1' />,
        roles: ["users"]
    },
    { 
        name: "Library Sistem", 
        path: "/lib-system", 
        icon: <SquareLibrary className='text-2xl pr-1'/>, 
        roles: ["edmin", "petugas"] },
    {
        name: "Daily Report",
        path: "/daily-report",
        icon: <Asterisk className='pr-1' />,
        roles: ["edmin", "petugas"],
        sublink: [
            { name: "Loan Report", path: "/loan-report", icon: <Clipboard className='text-2xl pr-1'/>, roles: ["edmin", "petugas"] },
            { name: "Overdue Report", path: "/overdue-report", icon: <RedoDot className='text-2xl pr-1'/>, roles: ["edmin", "petugas"] },
        ]
    },
    {
        name: "Analysis Report",
        path: "/analysis-report",
        icon: <ChartNoAxesCombined className='pr-1' />,
        roles: ["edmin", "petugas"],
        sublink: [
            { name: "Top Book", path: "/top-book", icon: <ListStart className='text-2xl pr-1'/>, roles: ["edmin", "petugas"] },
            { name: "Top Member", path: "/top-member", icon: <Flame className='text-2xl pr-1'/>, roles: ["edmin", "petugas"] },
            { name: "Genre Report", path: "/genre-report", icon: <CircleSmall className='text-2xl pr-1'/>, roles: ["edmin", "petugas"] },
        ]
    },
    {
        name: "Manage Content",
        path: "/manage-content",
        icon: <TableOfContents className='pr-1' />,
        roles: ["edmin", "petugas"],
        sublink: [
            { name: "Library Agendas", path: "/lib-agendas", icon: <Calendars className='text-2xl pr-1'/>, roles: ["edmin", "petugas"] },
            { name: "Article Controls", path: "/article-controls", icon: <Newspaper className='text-2xl pr-1'/>, roles: ["edmin", "petugas"] },
        ]
    },
    // profile account
    {
        name: "Profile",
        path: "/profile",
        icon: <UserPen className='text-2xl pr-1' />,
        roles: ["edmin", "petugas", "users"]
    },
    {
        name: "Auth Logs Activity",
        path: "/auth-logs",
        icon: <Logs className='text-2xl pr-1' />,
        roles: ["edmin", "petugas", "users"]
    },
    {
        name: "Settings",
        path: "/setting",
        icon: <Settings className='text-2xl pr-1' />,
        roles: ["edmin", "petugas", "users"]
    },
];