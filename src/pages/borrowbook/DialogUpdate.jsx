import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import SearchOption from './SearchOption';
import { useDebounce } from 'use-debounce';
import { pb } from '@/utils/pocketbase';

export default function DialogUpdate({title, openToggle, setOpenToggle, handleUpdate }){
    const [showInput, setShowInput] = useState({
        peminjam: false,
        buku: false,
        petugas: false,
        tglPeminjaman: false,
    })

    const [searchTermPeminjam, setSearchTermPeminjam] = useState('');
    const [searchTermBuku, setSearchTermBuku] = useState('');
    const [searchTermPetugas, setSearchTermPetugas] = useState('');
    const dateTimeRef = useRef(null)

    const [searchItemPeminjam] = useDebounce(searchTermPeminjam, 500)
    const [searchItemBuku] = useDebounce(searchTermBuku, 500)
    const [searchItemPetugas] = useDebounce(searchTermPetugas, 500)

    const { data: users } = useQuery({
        queryKey: ["users", searchItemPeminjam],
        queryFn: async () => pb.collection("users").getList(1, 10, {
            fields: "id,name,role",
            filter: `${searchItemPeminjam ? `name ~ "${searchItemPeminjam}"` : ""}`
        })
    })

    const { data: books } = useQuery({
        queryKey: ["books", searchItemBuku],
        queryFn: async () => pb.collection("books").getList(1, 10, {
            fields: "id,title",
            filter: `${searchItemBuku ? `title ~ "${searchItemBuku}"` : ""}`
        })
    })

    const { data: managers } = useQuery({
        queryKey: ["managers", searchItemPetugas],
        queryFn: async () => pb.collection("users").getList(1, 10, {
            fields: "id,name",
            filter: `role = "petugas" ${searchItemPetugas ? `&& name ~ "${searchItemPetugas}"` : ""}`
        })
    })

    const handleSetOpenToggle = () => {
        setOpenToggle()
    }
    
    return (
        <Dialog open={openToggle?.status} onClose={handleSetOpenToggle}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/80"/>
            <DialogPanel
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[90vw] max-w-md sm:w-full bg-background border p-6 sm:p-10 rounded-lg shadow-lg"
            >
            <div className="float-end" onClick={handleSetOpenToggle}>
                <X size={20} />
            </div>
            <DialogHeader>
                <DialogTitle className="text-lg text-center uppercase">UPDATED {title}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm text-muted-foreground">
                <div className="overflow-hidden">
                    <form onSubmit={(e) => handleUpdate(e, openToggle?.data?.id)} method="post" className='flex flex-col gap-2 p-1'>
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, peminjam: !showInput?.peminjam}))}>
                            Set Peminjam
                        </div>
                        { showInput?.peminjam && (
                            <label htmlFor="peminjam">
                                <p className='text-black'>Peminjam<span className='text-red-600'>*</span></p>
                                <SearchOption 
                                    name={'peminjam'} 
                                    users={users} 
                                    searchTerm={searchTermPeminjam} 
                                    setSearchTerm={setSearchTermPeminjam} 
                                    displayField={"name"}
                                    required={true}
                                    defaultValueId={openToggle?.data?.peminjam}
                                    defaultValueName={openToggle?.data?.expand?.peminjam?.name}
                                />
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, buku: !showInput?.buku}))}>
                            Set Buku
                        </div>
                        { showInput?.buku && (
                            <label htmlFor="buku">
                                <p className='text-black'>Buku<span className='text-red-600'>*</span></p>
                                <SearchOption 
                                    name={'buku'} 
                                    users={books} 
                                    searchTerm={searchTermBuku} 
                                    setSearchTerm={setSearchTermBuku} 
                                    displayField={"title"}
                                    required={true}
                                    defaultValueId={openToggle?.data?.buku}
                                    defaultValueName={openToggle?.data?.expand?.buku?.title}
                                />
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, petugas: !showInput?.petugas}))}>
                            Set Petugas
                        </div>
                        { showInput?.petugas && (
                            <label htmlFor="petugas">
                                <p className='text-black'>Petugas<span className='text-red-600'>*</span></p>
                                <SearchOption 
                                    name={'petugas'} 
                                    users={managers} 
                                    searchTerm={searchTermPetugas} 
                                    setSearchTerm={setSearchTermPetugas} 
                                    displayField={"name"}
                                    required={true}
                                    defaultValueId={openToggle?.data?.petugas}
                                    defaultValueName={openToggle?.data?.expand?.petugas?.name}
                                />
                            </label>
                        )}
                        <button className='btn btn-neutral' type='submit'>submit</button>
                    </form>
                </div>
            </div>
            </DialogPanel>
        </Dialog>
    )
}
