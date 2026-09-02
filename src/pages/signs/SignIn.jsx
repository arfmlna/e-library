import { useEffect, useState } from 'react'
import { pb } from '../../utils/pocketbase.js'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { logs } from '@/constants/logs.jsx'
import { FaArrowLeft } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'

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
        if (role) {
            window.location.href = "/"
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
                    window.location.href = "/"
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
                    status: 'unverified'
                }
            });

            if (authData.token) {
                logs(authData.record.id, 'login', 'google')
                window.location.href = "/"
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
        <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4 py-12 text-base-content transition-colors duration-300 relative">
            {/* Tombol Kembali - Responsif menyesuaikan padding layar */}
            <button 
                onClick={() => navigate('/home')} 
                className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
                <FaArrowLeft size={16} />
                <span>Kembali</span>
            </button>

            {/* Card Wrapper - Lebar fleksibel & maksimal melebar proporsional */}
            <div className="card bg-base-100 shadow-xl border border-base-300 w-full max-w-md p-6 md:p-8 rounded-2xl transition-all duration-300">
                
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
                        <div className="flex justify-between">
                            <legend className={`fieldset-legend font-medium select-none ${statusInput?.pass?.isError ? 'text-error' : 'text-base-content/80'}`}>
                                Password
                            </legend>
                            <NavLink className='mt-2' to="/forgot-password">
                                Forgot Password?
                            </NavLink>
                        </div>
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
                    

                    {/* Tombol Aksi Utama */}
                    <div className="space-y-3">
                        <button className="btn btn-primary w-full font-semibold shadow-md" type="submit">
                            Submit
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => setShowBtnLogin(!showBtnLogin)} 
                            className="btn btn-outline btn-sm w-full font-medium"
                        >
                            {showBtnLogin ? 'Sembunyikan Metode Lainnya' : 'Metode Lainnya'}
                        </button>
                    </div>
                </form>

                {/* Opsi Login Sosial / OAuth (Dipindahkan ke dalam Card agar rapi saat meluas) */}
                <div className={`transition-all duration-300 ease-in-out ${showBtnLogin ? 'opacity-100 max-h-24 mt-6 pt-4 border-t border-base-300' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'}`}>
                    <div className="flex flex-col gap-3">
                        {/* Google Button */}
                        <button 
                            type="button"
                            className="btn btn-outline w-full flex items-center justify-center gap-2 border-base-300 hover:bg-base-200" 
                            onClick={() => OAuthGoogle()}
                        >
                            <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="m0 0H512V512H0" fill="none"></path> {/* Diperbaiki ke fill="none" agar transparan mengikuti tema */}
                                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                            </svg>
                            <span>Masuk dengan Google</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
