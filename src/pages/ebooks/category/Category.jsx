import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import TemplateEBook from './TemplateCategory'
import { pb } from '@/utils/pocketbase'

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
        <TemplateEBook title={"Category"} fullData={fullData} refreshData={refreshData} searchItem={searchItem} setSearchItem={setSearchItem} page={page} setPage={setPage} searchTerm={searchTerm} />
    )
}
