import React, { lazy, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { pb } from '@/utils/pocketbase'

const TemplateCategory = lazy(() => import('./TemplateSupplier'))

export default function Supplier() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)

    const { data: fullData, refetch: refreshData } = useQuery({
        queryKey: ['all', searchTerm, page], 
        queryFn: () => pb.collection('supplier').getList(page, 8, {
            filter: `${searchTerm ? `supplier ~ "${searchTerm}"` : ""}`,
            sort: '-created'
        }),
        keepPreviousData: true
    });
    return (
        <TemplateCategory 
        title={"data supplier"}
        subtitle={"Kelola data supplier buku, dan pencarian supplier."}
        tb={'supplier'}
        fullData={fullData}
        refreshData={refreshData}
        searchItem={searchItem}
        setSearchItem={setSearchItem}
        page={page}
        setPage={setPage}
        searchTerm={searchTerm}
        />
    )
}
