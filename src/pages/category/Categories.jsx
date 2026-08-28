import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import anonim from '/sketch.png'
import { Link } from 'react-router-dom'
import Layout from '@/components/ui/layout'
import PdfToPoster from '@/components/poster/PdftoPoster'

const CategoryItem = ({ data }) => {
    const posterUrl = useMemo(() => {
        const mockBookRecord = {
            id: data.latest_book_id,
            collectionId: data.latest_book_collection_id,
            collectionName: 'books',
        };
        return data?.latest_poster ? pb.files.getURL(mockBookRecord, data?.latest_poster) : null;
    }, [data]);

    return (
        <Link to={'/category/'+data?.name} key={data.id}>
            <div className="group rounded-md relative overflow-hidden aspect-video bg-gray-100 shadow-md shadow-blue-600">
                { data?.latest_poster ? (
                    <img
                        className="w-full h-full object-cover transition-transform duration-300 grayscale group-hover:scale-105 group-hover:grayscale-0"
                        src={posterUrl}
                        alt={data?.name} 
                    />
                ) : data?.latest_pdf_file ? (
                    <div className="w-full h-full object-cover transition-transform duration-300 grayscale group-hover:scale-105 group-hover:grayscale-0">
                        <div className="w-full h-full overflow-hidden">
                            <PdfToPoster pdfFile={posterUrl} height={400}/>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full object-cover transition-transform duration-300 grayscale group-hover:scale-105 group-hover:grayscale-0">
                        <div className="flex flex-row items-center h-full bg-white/40 dark:bg-black text-black dark:text-white">
                            <h1 className='text-4xl pl-15'>N/A</h1>
                        </div>
                    </div>
                ) }
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 z-20 flex flex-col justify-center p-3 text-white">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col justify-center">
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
                        <div className="group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full max-w-sm overflow-hidden rounded-lg aspect-square border-4 border-black dark:border-white">
                                { data?.latest_poster ? (
                                    <img className='object-cover w-full h-full bg-center' src={posterUrl} alt={data?.name} />
                                ) : data?.latest_pdf_file ? (
                                    <div className="card ring-2 ring-black shadow-md shadow-blue-700 w-36 h-36 group-hover/tapGallery:scale-105 hover:transition hover:duration-300 hover:ease-in-out bg-cover relative overflow-hidden bg-base-200">
                                        <div className="w-full h-full overflow-hidden">
                                            <PdfToPoster pdfFile={posterUrl} height={175}/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card w-full h-full group-hover/tapGallery:scale-105 hover:transition hover:duration-300 hover:ease-in-out bg-cover overflow-hidden">
                                        <div className="flex flex-row justify-center items-center h-full bg-white dark:bg-black text-black dark:text-white">
                                            <h1 className='text-4xl'>N/A</h1>
                                        </div>
                                    </div>
                                ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

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
        <Layout 
        title={"Categories"} 
        subtitle={"cari buku berdasarkan kategori"}
        searchItem={false} >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-20">
            {category?.items?.map((data) => {
                
                return (
                    <CategoryItem data={data} key={data?.id} />
                );
            })}
            </div>
        </Layout>
    )
}
