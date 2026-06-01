import { Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from '@/components/animate-ui/primitives/headless/dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function DialogUpdate({title, openToggle, setOpenToggle, handleUpdate, password, setPassword, avatar, handlePreviewAvatar }){
    const [showInput, setShowInput] = useState({
        email: false,
        name: false,
        role: false,
        avatar: false,
        password: false
    })

    const handleSetOpenToggle = () => {
        setShowInput({
            avatar: false,
            name: false,
            role: false,
            email: false,
            password: false
        })
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
                        <div className="btn btn-neutral" onClick={() => setShowInput((p) => ({...p, email: !showInput?.email}))}>
                            Set Email
                        </div>
                        { showInput?.email && (
                            <label htmlFor="email">
                                <p className='text-black'>Email<span className='text-red-600'>*</span></p>
                                <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="email" name="email" id="email" placeholder='Insert Email...' required defaultValue={openToggle?.data?.email} />
                            </label>
                        ) }
                        <div className="btn btn-neutral" onClick={() => setShowInput((p) => ({...p, name: !showInput?.name}))}>
                            Set Name
                        </div>
                        { showInput?.name && (
                            <label htmlFor="name">
                                <p className='text-black'>Name<span className='text-red-600'>*</span></p>
                                <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="text" name="name" id="name" placeholder='Insert Name...' required defaultValue={openToggle?.data?.name} />
                            </label>
                        ) }
                        { title === 'all role' && (
                            <>
                            <div className="btn btn-neutral" onClick={() => setShowInput((p) => ({...p, role: !showInput?.role}))}>
                                Set Position
                            </div>
                            { showInput?.role && (
                                <label htmlFor="role">
                                    <p className='text-black'>Role<span className='text-red-600'>*</span></p>
                                    <select name="role" id="role" className='w-full h-10 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' defaultValue={openToggle?.data?.role}>
                                        <option value="petugas">Petugas</option>
                                        <option value="users">Siswa</option>
                                    </select>
                                </label>
                            ) }
                            </>
                        )}
                        <div className="btn btn-neutral" onClick={() => setShowInput((p) => ({...p, avatar: !showInput?.avatar}))}>
                            Set Avatar
                        </div>
                        { showInput?.avatar && (
                            <label htmlFor="avatar">
                                <p className='text-black'>Avatar</p>
                                <input className='w-full h-10 p-2 mb-1 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="file" name="avatar" id="avatar" placeholder='Insert Name...' onChange={handlePreviewAvatar} />
                                { avatar ? (
                                    <img className='border-2 border-black rounded-md object-cover aspect-video' src={avatar} alt="avatar" />
                                ) : openToggle?.data?.avatar && (
                                    <img className='border-2 border-black rounded-md object-cover aspect-video' src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${openToggle?.data?.collectionId}/${openToggle?.data?.id}/${openToggle?.data?.avatar}`} alt="avatar" />
                                ) }
                            </label>
                        ) }
                        <div className="btn btn-neutral" onClick={() => setShowInput((p) => ({...p, password: !showInput?.password}))}>
                            Set Password
                        </div>
                        { showInput.password && (
                            <div className={`flex flex-row gap-2`}>
                                <label htmlFor="password">
                                    <p className='text-black'>Password<span className='text-red-600'>*</span></p>
                                    <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="password" name="password" id="password" placeholder='Insert Password...' required onChange={setPassword} />
                                </label>
                                <label htmlFor="passwordConfirm">
                                    <p className='text-black'>Confirm Password<span className='text-red-600'>*</span></p>
                                    <input className='w-full h-8 p-2 border-2 border-black outline-none focus:border-blue-500 rounded-xs text-black' type="password" name="passwordConfirm" id="passwordConfirm" placeholder='Insert Confirm Password...' onChange={setPassword} required />
                                </label>
                            </div>
                        ) }
                        <button className='btn btn-neutral' type='submit' disabled={password}>submit</button>
                    </form>
                </div>
            </div>
            </DialogPanel>
        </Dialog>
    )
}
