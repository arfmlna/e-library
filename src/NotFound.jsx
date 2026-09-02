import React from 'react'

export default function NotFound({code, text}) {
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
        <h1 className='text-5xl font-bold text-center font-mono select-none'>
            <span className='light:text-white dark:text-[#1D232A] bg-red-500 p-2 rounded-l-md'>
                {code}
            </span>
            <span className='py-2 px-px ml-0.5 dark:bg-white light:bg-[#1D232A]'></span>
            <span className='py-2 px-px ml-0.5 dark:bg-white light:bg-[#1D232A]'></span>
            <span className='py-2 px-px ml-0.5 dark:bg-white light:bg-[#1D232A]'></span>
            <span className='py-2 px-px ml-0.5 dark:bg-white light:bg-[#1D232A]'></span>
            <span className='p-2 rounded-r-md dark:bg-white dark:text-[#1D232A] light:bg-[#1D232A] light:text-white'>
                {text}
            </span>
        </h1>
    </div>
  )
}
