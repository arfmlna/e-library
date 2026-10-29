import { BookOpen, Grid, LibraryBig, List } from 'lucide-react'
import React, { lazy, useState } from 'react'
const SearchData = lazy(() => import('@/components/search/Search'))

export default function Layout({
  title, 
  subtitle, 
  books, 
  categoryList=null, 
  setCategory, 
  searchItem, 
  handleChange, 
  handleBookType,
  viewMode, 
  setViewMode, 
  selectedType,
  children
}) {  
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 uppercase">
                <div className="p-2 border-2 border-black dark:border-white text-black dark:text-white rounded-lg">
                  <LibraryBig size={20} className="animate-accordion-down" /> 
                </div>
                {title}
              </h1>
              { subtitle && (
                <p className="text-sm mt-1">{subtitle}</p>
              ) }
          </div>
          { selectedType && (
            <div className="flex bg-slate-200 dark:bg-gray-800 p-1 rounded-lg self-center">
              {[
                { "name": "Semua", "type": "all"},
                { "name": "Digital", "type": "digital"},
                { "name": "Academic", "type": "academic"},
                { "name": "Non Academic", "type": "nonAcademic"},
              ].map((items, i) => (
                <button 
                key={i}
                onClick={() => handleBookType(items?.type)}
                className={`px-2 py-1 text-xs md:px-4 md:py-1.5 md:text-sm font-medium rounded-md transition 
                ${selectedType === items?.type ? 'bg-white dark:bg-black shadow-sm' : 'text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-gray-400'}`}
                >
                  {items?.name}
                </button>
              ))}
            </div>
          ) }

        </header>
          { searchItem !== false && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <SearchData setSearchItem={handleChange} />
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg border-2 ${viewMode === 'grid' ? 'border-gray-800 dark:border-indigo-50' : 'border-slate-800 dark:border-slate-50'}`}
                >
                  <Grid size={18} />
                </button>
                <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border-2 ${viewMode === 'list' ? 'border-gray-800 dark:border-indigo-50' : 'border-slate-800 dark:border-slate-50'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          ) }
      { searchItem !== false && (
        <div className="mt-3 mb-7 flex flex-col md:flex-row gap-5">
            { categoryList && (
              <div className="w-fit">
                <select name="category" id="category" className='select select-sm' onChange={(e) => setCategory(e.target.value)}>
                    <option disabled={true}>choose chategory</option>
                    <option className='capitalize' value={""}>Semua</option>
                    { Array.isArray(categoryList) && categoryList.map((data) => <option className='capitalize' key={data?.id} value={data?.id}>{data?.name}</option> ) }
                </select>
              </div>
            ) }
          <div className="ml-auto">
            <div className="flex gap-2">
            { searchItem && (
              <span className='btn btn-sm'>
                    Search: "{ searchItem }"
                </span>
            ) }
            { books?.totalItems && (
                <span className='btn btn-sm'>
                    Total: "{ books?.totalItems }"
                </span>
            ) }
            </div>
          </div>
        </div>
      ) }
        { children }
      </div>
    </div>
  )
}
