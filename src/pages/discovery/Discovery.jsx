import React, { lazy } from 'react'

const LatestBook = lazy(() => import('@/components/book/LatestBook'))
const BookRecommendations = lazy(() => import('@/components/book/RecomendationBook'))

export default function Discovery() {
  return (
    <div>
        <BookRecommendations/>
        <LatestBook />
    </div>
  )
}
