import { pb } from '@/utils/pocketbase'
import React from 'react'

export default function Profile() {
    const myData = pb.authStore.record
    console.log(myData)
    return (
        <div className='w-full pt-28 flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-bold select-none'>
                Profile
            </h1>
            <div className="min-h-screen">
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center mt-10">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>:</td>
                                    <td>{myData.name}</td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td>:</td>
                                    <td>Tasikmalaya</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mx-80"></div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Birth</td>
                                    <td>:</td>
                                    <td>28 April 2003</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>:</td>
                                    <td>Mahasiswa</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
