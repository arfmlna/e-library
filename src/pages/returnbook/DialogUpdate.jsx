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
        petugas: false,
        tglPengembalian: false,
        denda: false,
        catatan: false
    })

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

    const handleSetOpenToggle = () => {
        setOpenToggle()
    }

    const getLocalDateTimeString = (dateInput) => {
        const dateToParse = dateInput ? new Date(dateInput) : new Date();
        
        if (isNaN(dateToParse.getTime())) {
            return ""; // Kembalikan string kosong jika format tanggal rusak
        }

        const offset = dateToParse.getTimezoneOffset() * 60000;
        const localISOTime = new Date(dateToParse.getTime() - offset).toISOString();
        
        return localISOTime.substring(0, 16);
    };


    
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
                                    users={peminjaman} 
                                    searchTerm={searchTermPeminjam} 
                                    setSearchTerm={setSearchTermPeminjam} 
                                    displayField={"expand.peminjam.name"}
                                    displayField2={"expand.buku.title"}
                                    required={true}
                                    defaultValueId={openToggle?.data?.id}
                                    defaultValueName={openToggle?.data?.expand?.peminjam?.expand?.peminjam?.name}
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
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, tglPengembalian: !showInput?.tglPengembalian}))}>
                            Set Tanggal Pengembalian
                        </div>
                        { showInput?.tglPengembalian && (
                            <label htmlFor="tglPengembalian">
                                <p className="text-black">Tanggal Peminjaman<span className='text-red-600'>*</span></p>
                                <input 
                                className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black'    type="datetime-local" 
                                name="tglPengembalian" 
                                id="tglPengembalian"
                                required
                                ref={dateTimeRef}
                                defaultValue={getLocalDateTimeString(openToggle?.data?.tglPengembalian)}
                                onClick={() => dateTimeRef.current && dateTimeRef.current.showPicker()}
                                />
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, denda: !showInput?.denda}))}>
                            Set Denda
                        </div>
                        { showInput?.denda && (
                            <label htmlFor="denda">
                                <p className="text-black">Denda<span className='text-red-600'>*</span></p>
                                <input 
                                className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black'    
                                type="number"
                                name="denda" 
                                id="denda"
                                defaultValue={openToggle?.data?.denda}
                                required
                                />
                            </label>
                        )}
                        <div className="btn btn-neutral capitalize" onClick={() => setShowInput((p) => ({...p, catatan: !showInput?.catatan}))}>
                            Set Catatan
                        </div>
                        { showInput?.catatan && (
                            <label htmlFor="catatan">
                                <p className="text-black">Catatan</p>
                                <textarea className='w-full h-20 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' 
                                name="catatan" 
                                id="catatan"
                                defaultValue={openToggle?.data?.catatan}/>
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
