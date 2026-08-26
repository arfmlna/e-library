import React, { lazy, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { pb } from '@/utils/pocketbase'

const TemplateCategory = lazy(() => import('./TemplateAgendas'))

export default function Agendas() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)

    const { data: fullData, refetch: refreshData } = useQuery({
        queryKey: ['all', searchTerm, page], 
        queryFn: () => pb.collection('agendas').getList(page, 8, {
            filter: `${searchTerm ? `title ~ "${searchTerm}"` : ""}`,
            sort: '-created'
        }),
        keepPreviousData: true
    });
    return (
        <TemplateCategory 
        title={"data agendas perpustakaan"}
        subtitle={"Kelola data agenda yang dijalankan perpustakaan."}
        tb={'agendas'}
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
