import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pb } from '@/utils/pocketbase'
import { useDebounce } from 'use-debounce'
import TemplateBooks from './TemplateBooks'

export default function BooksControl() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)

    const { data: fullData, refetch: refreshData } = useQuery({
        queryKey: ['books', searchTerm, page], 
        queryFn: () => pb.collection('books').getList(page, 8, {
            filter: `${searchTerm ? `title ~ "${searchTerm}"` : ""}`,
            expand: 'category,uploader',
            sort: '-created'
        }),
        keepPreviousData: true
    });
    return (
        <>
            <TemplateBooks title={"Kelola Buku"} fullData={fullData} tb={'books'} refreshData={refreshData} searchItem={searchItem} setSearchItem={setSearchItem} page={page} setPage={setPage} searchTerm={searchTerm} />
        </>
    )
}
