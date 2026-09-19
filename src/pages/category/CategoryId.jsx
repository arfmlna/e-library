import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { lazy, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'

const LayoutBook = lazy(() => import('../books/LayoutBook'))

export default function CategoryId() {
    const [searchItem, setSearchItem] = useState("")
    const [page, setPage] = useState(1)

    const [searchTerm] = useDebounce(searchItem, 500)
    const { categoryName } = useParams()
    
    const filterConditions = [];
    
    if (categoryName) {
        filterConditions.push(pb.filter("category.name ?~ {:catName}", { catName: categoryName }));
    }
    if (searchTerm) {
        filterConditions.push(pb.filter("title ~ {:search}", { search: searchTerm }));
    }


    const { data: category, refetch: refreshData, isLoading, error } = useQuery({
        queryKey: ['category', categoryName, searchTerm, page],
        queryFn: () => pb.collection('books').getList(page, 10, {
            filter: filterConditions.length > 0 ? filterConditions.join(" && ") : "",
            expand: 'category,uploader,supplier',
            sort: '-created'
        }),
        keepPreviousData: true
    })

    return (
        <div>
            <LayoutBook 
            title={categoryName} 
            books={category} 
            refreshData={refreshData} 
            searchItem={searchItem} 
            setSearchItem={setSearchItem} 
            page={page} 
            setPage={setPage} 
            isLoading={isLoading}
            error={error}
            />
        </div>
    )
}
