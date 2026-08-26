import LatestBook from '@/components/book/LatestBook'
import BookRecommendations from '@/components/book/RecomendationBook'
import React from 'react'

export default function Discovery() {
  return (
    <div>
        <BookRecommendations/>
        <LatestBook />
    </div>
  )
}
