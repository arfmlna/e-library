import { getOfflineBooksList } from '@/constants/globals';
import { pb } from '@/utils/pocketbase';
import { useQuery } from '@tanstack/react-query';
import React, { lazy, useState } from 'react'
import { useDebounce } from 'use-debounce';

const LayoutBook = lazy(() => import('./LayoutBook'));

const Downloads = () => {
  const [searchItem, setSearchItem] = useState("")
  const [page, setPage] = useState(1)

  const [searchTerm] = useDebounce(searchItem, 500)
  const myId = pb?.authStore?.record?.id

  const { data: books, refetch: refreshData } = useQuery({
    queryKey: ['books', searchTerm, page],
    queryFn: () => getOfflineBooksList(page, 10, searchTerm, myId),
    enabled: !!myId,
    
    placeholderData: (previousData) => previousData,  
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: Infinity,
  });

  return (
    <LayoutBook 
    title={'Books Offline'} 
    books={books} 
    refreshData={refreshData} 
    searchItem={searchItem} 
    setSearchItem={setSearchItem} 
    page={page} 
    setPage={setPage} 
    />
  );
};

export default Downloads
