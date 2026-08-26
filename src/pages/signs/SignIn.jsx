import { useEffect, useState } from 'react'
import { pb } from '../../utils/pocketbase.js'
import { useNavigate } from 'react-router-dom'
import cookie from 'js-cookie'
import Swal from 'sweetalert2'
import { logs } from '@/constants/logs.jsx'

export default function SignIn() {
    const [getShow, setShow] = useState('password')
    const [showBtnLogin, setShowBtnLogin] = useState(false)
    const [statusInput, setStatusInput] = useState({
        email: { color: 'black', status: false, icon: '🤔', message: '' },
        pass: { color: 'black', status: false, icon: '🤔', message: '' },
    })

    const navigate = useNavigate()
    const role = pb?.authStore?.record?.role
    // const valid = pb?.authStore?.isValid
    
    useEffect(() => {
        if (!role) return; 
        if (role === 'users') {
            navigate('/downloads', { replace: true });
        } else if (role === 'edmin' || role === 'petugas') {
            navigate('/dashboard', { replace: true });
        }
    }, [role, navigate]); 

    const login = async (user, pass) => {
        try {
            const authData = await pb.collection('users').authWithPassword(user, pass)
            if (authData?.token) {
                return authData
            }
        } catch (error) {
            if (error.status === 400) {
                setStatusInput({
                    pass: {
                        color: 'red-700',
                        status: false,
                        icon: '❌',
                        message: 'Password Salah!'
                    }
                })
            } else {
                Swal.fire({
                    title: "Informasi",
                    text: "Terjadi Kesalahan Sistem!",
                    icon: "error",
                    confirmButtonText: "Ok!"
                })
            }
            throw error;
        }
    }
    
    const handleForm = async (e) => {
        e.preventDefault()
        const f = new FormData(e.target)
        const user = f.get('user'), pass = f.get('pass')
        try {
            const res = await login(user, pass)
            if (res?.token) {
                await logs(res.record.id, 'login', 'password')
            }
            Swal.fire({
                title: "Informasi",
                text: "Login Account Berhasil ✅",
                icon: "success",
                confirmButtonText: "Ok!"
            }).then(r => {
                if (r.isConfirmed) {
                    if (pb.authStore.record.role === 'users') {
                        window.location.href = "/downloads"
                    } else {
                        window.location.href = "/dashboard"
                    }
                }
            });
        } catch (err) { 
            Swal.fire({
                title: "Gagal",
                text: "Username atau Password salah ❌",
                icon: "error"
            });
            console.error(err.originalError);
            console.error(err);
        }
    }

    const OAuthGoogle = async () => {
        try {
            const authData = await pb.collection('users').authWithOAuth2({ 
                provider: 'google',
                createData: {
                    role: 'users',
                    verified: false
                }
            });

            if (authData.token) {
                cookie.set("user", authData, { expires: 7 });
                logs(authData.record.id, 'login', 'google')
                if (pb.authStore.record.role === 'users') {
                    window.location.href = "/downloads"
                } else {
                    window.location.href = "/dashboard"
                }
            } else {
                throw new Error("Token Tidak di Temukan")
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Login Account Gagal ❌",
                icon: "error",
                confirmButtonText: "Ok!"
            })
            console.error(error)
            console.error(error.data.data)
        }

    }

    return (
        // <div className="">
        //     <div className='flex flex-col justify-center items-center w-screen min-h-screen px-5'>
        //         <div className="card ring-2 shadow-2xl w-full sm:w-full md:w-3/4 lg:w-2/4 xl:w-1/4 p-5">
        //             <h1 className='text-4xl font-bold text-center select-none text-shadow-2xs'>
        //                 Masuk
        //             </h1>
        //             <form className='mt-7' onSubmit={handleForm} method='POST'>
        //                 <fieldset className="fieldset block relative">
        //                     <label className={`text-black dark:text-white fieldset-legend textarea-md select-none text-${statusInput?.email?.color}`}>Email</label>
        //                     <input type="text" name='user' className={`p-2 text-${statusInput?.email?.color} text-[14.5px] rounded-sm outline-2 outline-${statusInput?.email?.color} w-full text-black dark:text-white`}  autoComplete='username'/>
        //                     <span className={`label mt-1 text-${ statusInput?.email?.color }`}>{ statusInput?.email?.message }</span>
        //                 </fieldset>
        //                 <fieldset className="fieldset block relative">
        //                     <label className={`text-black dark:text-white fieldset-legend textarea-md select-none text-${statusInput?.pass?.color}`}>Password</label>
        //                     <input type={getShow} name='pass' className={`p-2 text-${statusInput?.pass?.color} text-[14.5px] rounded-sm outline-2 outline-${statusInput?.pass?.color} w-full text-black dark:text-white`} 
        //                     autoComplete='current-password' />
        //                     <span className={`label mt-1 text-${ statusInput?.pass?.color }`}>{ statusInput?.pass?.message }</span>
        //                 <div className="flex flex-row gap-2 my-2">
        //                     <input onClick={(e) => e.target.checked ? setShow('text') : setShow('password')} className='checkbox checkbox-xs outline-2' type="checkbox" />
        //                     <span className='text-sm select-none'>show</span>
        //                 </div>
        //                 </fieldset>
        //                 <div className="">
        //                     <button className={`btn btn-neutral dark:btn-primary`} type='submit'>
        //                         submit
        //                     </button>
        //                 </div>
        //                 <div onClick={() => setShowBtnLogin(!showBtnLogin)} className='mt-5 italic text-center btn bg-black text-white dark:bg-white dark:text-black flex justify-center'>
        //                     Another
        //                 </div>
        //             </form>
        //         </div>
        //         <div className={`mt-5 grid gap-4 grid-cols-2 justify-evenly ${showBtnLogin ? 'block' : 'hidden'} transition ease-in-out duration-300`}>
        //             <button className="btn bg-white text-black border-[#e5e5e5]" onClick={() => OAuthGoogle()}>
        //                 Login with
        //                 <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        //                     <g>
        //                         <path d="m0 0H512V512H0" fill="#fff"></path>
        //                         <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
        //                         <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
        //                         <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
        //                         <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
        //                     </g>
        //                 </svg>
        //             </button>
        //             <button className="btn bg-[#2F2F2F] text-white border-black">
        //                 Login with
        //                 <svg aria-label="Microsoft logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        //                     <path d="M96 96H247V247H96" fill="#f24f23"></path>
        //                     <path d="M265 96V247H416V96" fill="#7eba03"></path>
        //                     <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
        //                     <path d="M265 265H416V416H265" fill="#f9ba00"></path>
        //                 </svg>
        //             </button>
        //         </div>
        //     </div>
        // </div>

        <div className="flex flex-col justify-center items-center w-screen min-h-screen px-5 bg-base-200 text-base-content transition-colors duration-300">
            {/* Card Wrapper */}
            <div className="card bg-base-100 shadow-2xl border border-base-300 w-full md:w-2/5 p-6 md:p-8 rounded-2xl">
                <h1 className="text-3xl font-extrabold text-center tracking-tight select-none mb-6">
                    Masuk
                </h1>
                
                <form onSubmit={handleForm} method="POST" className="space-y-5">
                    {/* Fieldset Email */}
                    <fieldset className="fieldset w-full">
                        <legend className={`fieldset-legend font-medium select-none ${statusInput?.email?.isError ? 'text-error' : 'text-base-content/80'}`}>
                            Email
                        </legend>
                        <input 
                            type="email" 
                            name="user" 
                            placeholder="nama@email.com"
                            className={`input input-bordered w-full focus:input-primary ${statusInput?.email?.isError ? 'input-error text-error' : ''}`}  
                            autoComplete="username"
                            required
                        />
                        {statusInput?.email?.message && (
                            <span className="fieldset-label text-error mt-1">{statusInput.email.message}</span>
                        )}
                    </fieldset>

                    {/* Fieldset Password */}
                    <fieldset className="fieldset w-full">
                        <legend className={`fieldset-legend font-medium select-none ${statusInput?.pass?.isError ? 'text-error' : 'text-base-content/80'}`}>
                            Password
                        </legend>
                        <input 
                            type={getShow} 
                            name="pass" 
                            placeholder="••••••••"
                            className={`input input-bordered w-full focus:input-primary ${statusInput?.pass?.isError ? 'input-error text-error' : ''}`} 
                            autoComplete="current-password"
                            required
                        />
                        {statusInput?.pass?.message && (
                            <span className="fieldset-label text-error mt-1">{statusInput.pass.message}</span>
                        )}
                        
                        {/* Toggle Show Password */}
                        <div className="flex flex-row gap-2 mt-2 items-center w-fit cursor-pointer select-none">
                            <input 
                                id="toggle-password"
                                onChange={(e) => e.target.checked ? setShow('text') : setShow('password')} 
                                className="checkbox checkbox-sm checkbox-primary rounded" 
                                type="checkbox" 
                            />
                            <label htmlFor="toggle-password" className="text-xs font-medium cursor-pointer text-base-content/70 hover:text-base-content">
                                Tampilkan password
                            </label>
                        </div>
                    </fieldset>

                    {/* Tombol Aksi */}
                    <div className="pt-2 space-y-3">
                        <button className="btn btn-primary w-full font-semibold shadow-md" type="submit">
                            Submit
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => setShowBtnLogin(!showBtnLogin)} 
                            className="btn btn-outline btn-sm w-full font-medium"
                        >
                            Metode Lainnya
                        </button>
                    </div>
                </form>
            </div>

            {/* Opsi Login Sosial / OAuth */}
            <div className={`mt-5 grid gap-4 grid-cols-2 w-full sm:w-full md:w-3/4 lg:w-2/4 xl:w-1/4 transition-all duration-300 ${showBtnLogin ? 'opacity-100 scale-100 max-h-40' : 'opacity-0 scale-95 max-h-0 overflow-hidden pointer-events-none'}`}>
                {/* Google Button */}
                <button 
                    type="button"
                    className="btn bg-base-100 text-base-content border-base-300 hover:bg-base-200 shadow-sm flex items-center justify-center gap-2" 
                    onClick={() => OAuthGoogle()}
                >
                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="m0 0H512V512H0" fill="#fff"></path>
                        <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                        <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                        <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                        <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                    </svg>
                    <span>Google</span>
                </button>
                
                {/* Microsoft Button */}
                <button 
                    type="button"
                    className="btn bg-[#2F2F2F] text-white hover:bg-[#1F1F1F] border-transparent shadow-sm flex items-center justify-center gap-2"
                >
                    <svg aria-label="Microsoft logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M96 96H247V247H96" fill="#f24f23"></path>
                        <path d="M265 96V247H416V96" fill="#7eba03"></path>
                        <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
                        <path d="M265 265H416V416H265" fill="#f9ba00"></path>
                    </svg>
                    <span>Microsoft</span>
                </button>
            </div>
        </div>
    )
}
