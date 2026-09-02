import { lazy } from 'react'
const SearchData = lazy(() => import('../search/Search'))

export default function LayoutDashboard({
    icon,
    title, 
    subtitle,
    children,
    searchItem,
    fullData,
    setSelectedIds,
    setSearchItem
}) {
    const handleChange = (result) => {
        setSelectedIds([])
        setSearchItem(result)
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 bg-base-100 text-base-content transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    {icon}
                    <span className="capitalize">Manajemen {title}</span>
                    </h1>
                    <p className="text-sm mt-1 text-base-content/70">{subtitle}</p>
                </div>
                </header>
                <main className="w-full">
                    <div className="mt-3 mb-7 gap-5 flex flex-col md:flex-row justify-center md:justify-end">
                        <SearchData setSearchItem={handleChange} />
                        <div className="ml-auto">
                            <div className="flex gap-2">
                            { searchItem && (
                                <span className='btn btn-sm'>
                                    Search: "{ searchItem }"
                                </span>
                            ) }
                            { fullData?.totalItems && (
                                <span className='btn btn-sm'>
                                    Total: "{ fullData?.totalItems }"
                                </span>
                            ) }
                            </div>
                        </div>
                    </div>
                    {children}
                </main>                
            </div>
        </div>
    )
}
