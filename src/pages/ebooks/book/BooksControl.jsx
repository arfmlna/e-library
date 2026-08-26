import { lazy, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'
import { useDebounce } from 'use-debounce'

const TemplateBooks = lazy(() => import('./TemplateBooks'))

export default function BooksControl() {
    const [searchItem, setSearchItem] = useState("")
    const [bookType, setBookType] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)
    const role = pb.authStore.record.role

    const { data: fullData, refetch: refreshData } = useQuery({
        queryKey: ['books', searchTerm, page, bookType], 
        queryFn: async () => {
            const conditions = [];

            if (bookType) {
                conditions.push(pb.filter("bookType ~ {:type}", { type: bookType }))
            }
            if (searchTerm) {
                conditions.push(pb.filter("title ~ {:search}", { search: searchItem }))
            }

            const finalFilterString = conditions.join(" && ");
            const targetPage = page && page > 0 ? page : 1;
            
            return pb.collection('books').getList(targetPage, 8, {
                filter: finalFilterString,
                expand: 'category,uploader,supplier',
                sort: '-created'
            })
        },
        keepPreviousData: true
    });
    return (
        <>
            <TemplateBooks 
            title={"data buku"} 
            subtitle={"Kelola data buku, kategori buku, dan pencarian buku."}
            fullData={fullData} 
            tb={'books'} 
            refreshData={refreshData} 
            searchItem={searchItem} 
            setSearchItem={setSearchItem} 
            page={page} 
            setPage={setPage} 
            searchTerm={searchTerm} 
            setBookType={setBookType}
            role={role}
            />
        </>
    )
}
