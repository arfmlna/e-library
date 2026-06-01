"use client"
import React, { useState } from 'react'
import { pb } from '../../utils/pocketbase'
import LayoutBook from './LayoutBook'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'

export default function Books() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)

    const { data: books, refetch: refreshData } = useQuery({
        queryKey: ['books', searchTerm, page],
        queryFn: () => pb.collection('books').getList(page, 8, {
            filter: `${searchTerm ? `title ~ "${searchTerm}"` : ""}`,
            expand: "uploader,category",
            sort: '-created'
        }),
        keepPreviousData: true
    })
    
    return (
        <>
            <LayoutBook title={'Books'} books={books} refreshData={refreshData} searchItem={searchItem} setSearchItem={setSearchItem} page={page} setPage={setPage} searchTerm={searchTerm} />
        </>
    )
}