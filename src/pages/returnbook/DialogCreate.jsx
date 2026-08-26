import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { pb } from '@/utils/pocketbase'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchOption from './SearchOption';

export default function DialogCreate({title, openToggle, setOpenToggle, handleAdd}){
    const [searchTermPeminjam, setSearchTermPeminjam] = useState('');
    const [searchTermPetugas, setSearchTermPetugas] = useState('');
    const dateTimeRef = useRef(null)

    const [searchItemPeminjam] = useDebounce(searchTermPeminjam, 500)
    const [searchItemPetugas] = useDebounce(searchTermPetugas, 500)

    const { data: peminjaman } = useQuery({
        queryKey: ["peminjaman", searchItemPeminjam],
        queryFn: async () => pb.collection("peminjaman").getList(1, 10, {
            expand: "peminjam,buku",
            filter: `${searchItemPeminjam ? `name ~ "${searchItemPeminjam}"` : ""}`
        })
    })

    const { data: managers } = useQuery({
        queryKey: ["managers", searchItemPetugas],
        queryFn: async () => pb.collection("users").getList(1, 10, {
            fields: "id,name",
            filter: `role = "petugas" ${searchItemPetugas ? `&& name ~ "${searchItemPetugas}"` : ""}`
        })
    })

    const handleClose = () => {
        setSearchTermPeminjam('');
        setSearchTermPetugas('');
        
        const formElement = document.getElementById('form-create-peminjaman');
        if (formElement) formElement.reset();

        setOpenToggle(false);
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        handleAdd(e)
        handleClose(); 
    };


    return (
        <Dialog open={openToggle} onClose={handleClose}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/80"/>
            <DialogPanel
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[90vw] max-w-md sm:w-full bg-background border p-6 sm:p-10 rounded-lg shadow-lg"
            >
            <div className="float-end" onClick={handleClose}>
                <X size={20} />
            </div>
            <DialogHeader>
                <DialogTitle className="text-lg text-center uppercase">CREATE {title}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm text-muted-foreground">
                <div className="overflow-hidden">
                    <form onSubmit={onSubmitForm} id='form-create-peminjaman' method="post" className='flex flex-col gap-2 p-1'>
                        <label htmlFor="peminjam">
                            <p className='text-black'>Peminjam<span className='text-red-600'>*</span></p>
                            <SearchOption 
                                name={'peminjam'} 
                                users={peminjaman} 
                                searchTerm={searchTermPeminjam} 
                                setSearchTerm={setSearchTermPeminjam} 
                                displayField={"expand.peminjam.name"}
                                displayField2={"expand.buku.title"}
                                required={true}
                            />
                        </label>
                        <label htmlFor="petugas">
                            <p className="text-black">Petugas<span className='text-red-600'>*</span></p>
                            <SearchOption 
                                name={'petugas'} 
                                users={managers} 
                                searchTerm={searchTermPetugas} 
                                setSearchTerm={setSearchTermPetugas} 
                                displayField={"name"}
                                required={true}
                            />
                        </label>
                        <label htmlFor="tglPengembalian">
                            <p className="text-black">Tanggal Peminjaman<span className='text-red-600'>*</span></p>
                            <input 
                            className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black'    type="datetime-local" 
                            name="tglPengembalian" 
                            id="tglPengembalian"
                            required
                            ref={dateTimeRef}
                            onClick={() => dateTimeRef.current && dateTimeRef.current.showPicker()}
                            />
                        </label>
                        <label htmlFor="denda">
                            <p className="text-black">Denda<span className='text-red-600'>*</span></p>
                            <input 
                            className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black'    
                            type="number"
                            name="denda" 
                            id="denda"
                            required
                            />
                        </label>
                        <label htmlFor="catatan">
                            <p className="text-black">Catatan</p>
                            <textarea className='w-full h-20 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' name="catatan" id="catatan"></textarea>
                        </label>
                        <button className='btn btn-neutral' type='submit'>submit</button>
                    </form>
                </div>
            </div>
            </DialogPanel>
        </Dialog>
    )
}
