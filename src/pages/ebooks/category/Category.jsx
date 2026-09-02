import React, { lazy, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { pb } from '@/utils/pocketbase'

const TemplateCategory = lazy(() => import('./TemplateCategory'))

export default function Category() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)

    const { data: fullData, refetch: refreshData } = useQuery({
        queryKey: ['all', searchTerm, page], 
        queryFn: () => pb.collection('categories').getList(page, 8, {
            filter: `${searchTerm ? `name ~ "${searchTerm}"` : ""}`,
            sort: '-created'
        }),
        keepPreviousData: true
    });
    return (
        <TemplateCategory 
        title={"data category"}
        subtitle={"Kelola data kategori buku, dan pencarian kategori."}
        fullData={fullData}
        refreshData={refreshData}
        searchItem={searchItem}
        setSearchItem={setSearchItem}
        setPage={setPage}
        searchTerm={searchTerm}
        />
    )
}
