import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import anonim from '/sketch.png'
import { Link } from 'react-router-dom'

export default function Categories() {
    const [page, setPage] = useState(1)
    const { data: category } = useQuery({
        queryKey: ['category'],
        queryFn: async () => {
            const res = pb.collection('categories').getList(page, 15, {
                sort: '-created'
            })
            return res
        }
    })
    return (
        <div className='w-full min-h-screen select-none pt-28 px-20'>
            <h1 className='text-4xl font-bold mb-1 text-center'>
                Category
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-20">
            {category?.items?.map((data) => {
                const imageUrl = data?.latest_poster ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${data?.latest_book_collection_id}/${data?.latest_book_id}/${data?.latest_poster}` : anonim;
                return (
                    <Link to={'/category/'+data?.name+'/'+data?.id} key={data.id}>
                        <div className="group rounded-md shadow-sm relative overflow-hidden aspect-video bg-gray-100">
                            <img
                                className="w-full h-full object-cover transition-transform duration-300 grayscale group-hover:scale-105 group-hover:grayscale-0"
                                src={imageUrl}
                                alt={data?.name} 
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />
                            <div className="absolute inset-0 z-20 flex flex-col justify-center p-3 text-white">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="group-hover:scale-105 transition-transform duration-300">
                                        <img className='aspect-square' src={imageUrl} alt={data?.name} />
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <h2 className="text-lg font-bold truncate mb-1 capitalize">{data?.name}</h2>
                                        <table className="text-xs text-gray-200 w-full structure-fixed">
                                            <tbody>
                                                <tr>
                                                    <td className="w-20 py-0.5 opacity-80">Total Buku</td>
                                                    <td className="py-0.5">: {data?.total_books || 0}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
        </div>
    )
}
