import { saveBookToOffline } from "@/constants/globals"
import useOnlineStatus from "@/constants/useOnlineStatus"
import { Download } from "lucide-react"
import { NavLink } from "react-router-dom"
import DialogInformation from "../ui/CardBook/DialogInformation"
import { formatDate } from "@/constants/dateFormat"
import { pb } from "@/utils/pocketbase"

const PopupInformation = ({ data, clickId, setClickId }) => {
    const isOnline = useOnlineStatus()
    const myId = pb.authStore.record.id
    return(
        <DialogInformation 
            title={"Informasi"}
            subTitle={"Informasi Meta Data Konten yang Tersedia"}
            content={
                <tbody>
                    <tr>
                        <td>Kode</td>
                        <td className='capitalize'>{ data?.kode_buku }</td>
                    </tr>
                    <tr>
                        <td>Judul</td>
                        <td className='capitalize'>{ data?.title }</td>
                    </tr>
                    <tr>
                        <td>Tipe Buku</td>
                        <td className='capitalize'>{ data?.bookType }</td>
                    </tr>
                    <tr>
                        <td>Publisher</td>
                        <td className='capitalize'>{ data?.expand?.supplier?.supplier }</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td className='flex flex-row flex-wrap gap-1'>
                            { data?.expand?.category 
                            ? data?.expand?.category?.map((data) => (
                                <div className="" 
                                    key={data?.id}>
                                    <NavLink 
                                        to={`/category/${data?.name}`} className='btn btn-neutral btn-xs mb-1 capitalize'
                                    >
                                        {data?.name}
                                    </NavLink>
                                </div>
                            )) 
                            : 'N/A' }
                        </td>
                    </tr>
                    <tr>
                        <td>Penulis</td>
                        <td className='capitalize'>{ data.author ? data.author : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Pengupload</td>
                        <td className='capitalize'>
                            { data?.expand?.uploader?.name ? 
                            data?.expand?.uploader?.name : 
                            'Unknow'}
                        </td>
                    </tr>
                    <tr>
                        <td>Tanggal Upload</td>
                        <td className='capitalize'>
                            { data?.publishDate ? formatDate(data?.publishDate) : 'Unknow'}
                        </td>
                    </tr>
                    { data?.bookType !== 'digital' && (
                        <tr>
                            <td>Stock</td>
                            <td className='capitalize'>
                                { data?.stock ? 
                                data?.stock : 
                                'N/A'}
                            </td>
                        </tr>
                    ) }
                </tbody>
            }
            download={
                isOnline && (
                    <button className="btn btn-neutral btn-sm flex-1 sm:flex-none px-4 py-2"
                        onClick={() => saveBookToOffline(data, myId)}
                    >
                        <Download size={15} />
                        Download
                    </button>
                )
            }
            clickId={clickId} 
            setClickId={setClickId} 
            redirect={'online'} 
            data={data} 
        />
    )
}

export default PopupInformation