import React, { lazy, useState } from 'react'
import { pb } from '../../utils/pocketbase'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'

const LayoutBook = lazy(() => import('./LayoutBook'))

export default function NonAcademicBooks() {
    const [searchItem, setSearchItem] = useState("")
    const [category, setCategory] = useState()
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)
    
    const { data: books, refetch: refreshData } = useQuery({
        queryKey: ['books', searchTerm, page, category],
        queryFn: async () => {
            const conditions = [`bookType = "nonAcademic"`];
            if (searchTerm) {
                conditions.push(pb.filter("title ~ {:search}", { search: searchTerm }));
            }
            if (category) {
                conditions.push(pb.filter("category ~ {:catId}", { catId: category }));
            }
            const finalFilterString = conditions.join(" && ");
            const targetPage = page && page > 0 ? page : 1;


            return pb.collection('books').getList(targetPage, 10, {
                filter: finalFilterString,
                expand: "uploader,category,supplier",
                sort: '-created'
            })
        },
        keepPreviousData: true,
        // staleTime: Infinity,
        // refetchOnWindowFocus: false, 
    })
    
    return (
        <>
            <LayoutBook 
            title={'Books Non Academic'} 
            subTitle={"Lihat detail buku fisik non akademik dalam satu tempat."}
            books={books} 
            refreshData={refreshData} 
            searchItem={searchItem} 
            setSearchItem={setSearchItem} 
            page={page} setPage={setPage} 
            searchTerm={searchTerm} 
            category={category} 
            setCategory={setCategory} 
            />
        </>
    )
}