import React, { Suspense } from 'react'
// import PWABadge from '../../PWABadge'

export default function SignUp() {
    const [statusInput, setStatusInput] = React.useState({
        user: {
            color: 'text-primary',
            icon: '!',
            message: 'Please enter your username'
        },
        pass: {
            color: 'text-primary',
            icon: '!',
            message: 'Please enter your password'
        }
    })
    const [getShow, setShow] = React.useState('password')

    const handleForm = () => {}
    const handleInputUser = () => {}
    const handleInputPass = () => {}

    return (
    <div className="">
            <div className='flex flex-row justify-center items-center w-screen min-h-screen px-5'>
                <div className="card w-full sm:w-full md:w-3/4 lg:w-2/4 xl:w-1/4 p-5">
                <h1 className='grad-text text-center pb-2 select-none'>
                    SignUp
                    <span className='text-white'>🚀</span>
                </h1>
                <form className='mt-7' onSubmit={handleForm} method='POST'>
                    <fieldset className="fieldset block relative">
                    <label className='fieldset-legend textarea-md select-none'>username :</label>
                    <input type="text" name='user' className={`input ${statusInput?.user?.color} w-full`} 
                    onChange={handleInputUser}/>
                    <span className='absolute right-1 top-11 z-10 text-lg'>{ statusInput?.user?.icon }</span>
                    <span className={`label mt-1 ${statusInput?.user?.color}`}>{ statusInput?.user?.message }</span>
                    </fieldset>
                    <fieldset className="fieldset block relative">
                    <label className='fieldset-legend textarea-md select-none'>password :</label>
                    <input type={getShow} name='pass' className={`input ${statusInput?.pass?.color} w-full`} 
                    onChange={handleInputPass} />
                    <span className='absolute right-1 top-11 z-10 text-lg'>{ statusInput?.pass?.icon }</span>
                    <span className={`label mt-1 ${statusInput?.pass?.color}`}>{ statusInput?.pass?.message }</span>
                    <div className="flex flex-row gap-2 my-2">
                        <input onClick={(e) => e.target.checked ? setShow('text') : setShow('password')} className='checkbox checkbox-sm outline-1' type="checkbox" />
                        <span className='text-sm select-none'>show</span>
                    </div>
                    </fieldset>
                    <button className={`btn btn-outline`} type='submit'>
                        submit
                    </button>
                </form>
                </div>
            </div>
            <Suspense fallback={
                <div className='min-h-screen w-full flex justify-center items-center'>
                <p className='text-center font-bold text-4xl'>Loading...</p>
                </div>
            }>
                {/* <PWABadge /> */}
            </Suspense>
        </div> 
    )
}
