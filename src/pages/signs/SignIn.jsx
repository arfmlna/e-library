import { useEffect, useState } from 'react'
import { pb } from '../../utils/pocketbase.js'
import { useNavigate } from 'react-router-dom'
import cookie from 'js-cookie'
import Swal from 'sweetalert2'
import { logs } from '@/constants/globals.jsx'

export default function SignIn() {
    const [getShow, setShow] = useState('password')
    const [showBtnLogin, setShowBtnLogin] = useState(false)
    const [statusInput, setStatusInput] = useState({
        email: { color: 'black', status: false, icon: '🤔', message: '' },
        pass: { color: 'black', status: false, icon: '🤔', message: '' },
    })

    const navigate = useNavigate()
    const role = pb?.authStore?.record?.role
    const valid = pb?.authStore?.isValid
    
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
                    // cookie.set("user", res);
                    if (pb.authStore.record.role === 'users') {
                        navigate("/downloads");
                    } else {
                        navigate("/dashboard");
                    }
                }
            });
        } catch (err) { 
            Swal.fire({
                title: "Gagal",
                text: "Username atau Password salah ❌",
                icon: "error"
            });
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
                logs(authData.record.id, 'login', 'oauth2')
                navigate('/dashboard')
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
        <div className="">
            <div className='flex flex-col justify-center items-center w-screen min-h-screen px-5'>
                <div className="card ring-2 shadow-2xl w-full sm:w-full md:w-3/4 lg:w-2/4 xl:w-1/4 p-5">
                    <h1 className='text-4xl font-bold text-center select-none text-shadow-2xs'>
                        Masuk
                    </h1>
                    <form className='mt-7' onSubmit={handleForm} method='POST'>
                        <fieldset className="fieldset block relative">
                            <label className={`text-black dark:text-white fieldset-legend textarea-md select-none text-${statusInput?.email?.color}`}>Email</label>
                            <input type="text" name='user' className={`p-2 text-${statusInput?.email?.color} text-[14.5px] rounded-sm outline-2 outline-${statusInput?.email?.color} w-full text-black dark:text-white`}  autoComplete='username'/>
                            <span className={`label mt-1 text-${ statusInput?.email?.color }`}>{ statusInput?.email?.message }</span>
                        </fieldset>
                        <fieldset className="fieldset block relative">
                            <label className={`text-black dark:text-white fieldset-legend textarea-md select-none text-${statusInput?.pass?.color}`}>Password</label>
                            <input type={getShow} name='pass' className={`p-2 text-${statusInput?.pass?.color} text-[14.5px] rounded-sm outline-2 outline-${statusInput?.pass?.color} w-full text-black dark:text-white`} 
                            autoComplete='current-password' />
                            <span className={`label mt-1 text-${ statusInput?.pass?.color }`}>{ statusInput?.pass?.message }</span>
                        <div className="flex flex-row gap-2 my-2">
                            <input onClick={(e) => e.target.checked ? setShow('text') : setShow('password')} className='checkbox checkbox-xs outline-2' type="checkbox" />
                            <span className='text-sm select-none'>show</span>
                        </div>
                        </fieldset>
                        <div className="">
                            <button className={`btn btn-neutral dark:btn-primary`} type='submit'>
                                submit
                            </button>
                        </div>
                        <div onClick={() => setShowBtnLogin(!showBtnLogin)} className='mt-5 italic text-center btn bg-black text-white dark:bg-white dark:text-black flex justify-center'>
                            Another
                        </div>
                    </form>
                </div>
                <div className={`mt-5 grid gap-4 grid-cols-2 justify-evenly ${showBtnLogin ? 'block' : 'hidden'} transition ease-in-out duration-300`}>
                    <button className="btn bg-white text-black border-[#e5e5e5]" onClick={() => OAuthGoogle()}>
                        Login with
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <g>
                                <path d="m0 0H512V512H0" fill="#fff"></path>
                                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                            </g>
                        </svg>
                    </button>
                    <button className="btn bg-[#2F2F2F] text-white border-black">
                        Login with
                        <svg aria-label="Microsoft logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M96 96H247V247H96" fill="#f24f23"></path>
                            <path d="M265 96V247H416V96" fill="#7eba03"></path>
                            <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
                            <path d="M265 265H416V416H265" fill="#f9ba00"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
