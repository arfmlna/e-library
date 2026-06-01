import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import LayoutBook from '../books/LayoutBook'
import { useDebounce } from 'use-debounce'

export default function CategoryId() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)

    const { categoryId, categoryName } = useParams()

    const { data: category, refetch: refreshData } = useQuery({
        queryKey: ['categoryId', categoryId, searchTerm, page],
        queryFn: () => pb.collection('books').getList(page, 8, {
            filter: `category ~ '${categoryId}' ${searchTerm ? `&& title ~ "${searchTerm}"` : ""}`,
            expand: 'category',
            sort: '-created'
        }),
        keepPreviousData: true
    })

    return (
        <div>
            <LayoutBook title={categoryName} books={category} refreshData={refreshData} searchItem={searchItem} setSearchItem={setSearchItem} page={page} setPage={setPage} searchTerm={searchTerm} />
        </div>
    )
}
