import { Search } from "lucide-react"
import { useState } from "react"

const SearchData = ({searchItem, setSearchItem}) => {
    const [getWrite, setWrite] = useState()
    const handleSubmit = (e) => {
        e.preventDefault()
        setSearchItem(getWrite)
    }
    return (
        <form onSubmit={handleSubmit} className="relative w-full sm:max-w-md">
            <label className="">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                type="search"
                placeholder="Cari judul buku atau penulis..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 dark:placeholder:text-white focus:border-transparent transition"
                value={getWrite} 
                onChange={(e) => setWrite(e.target.value)} />
                <kbd className="kbd kbd-sm absolute right-10 top-2.5">⌘</kbd>
                <kbd className="kbd kbd-sm absolute right-3 top-2.5">K</kbd>
            </label>
        </form>
    )
}

export default SearchData