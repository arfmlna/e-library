import DialogInformation from "@/components/ui/CardBook/DialogInformation"
import { formatDate } from "@/constants/dateFormat"
import { pb } from "@/utils/pocketbase"
import { NavLink } from "react-router-dom"

const PopupInformation = ({ data, clickId, setClickId, handleRemove }) => {
    const myId = pb?.authStore?.record?.id
    return(
        <DialogInformation
            title={"Informasi"}
            subTitle={"Informasi Meta Data Konten yang Tersedia"}
            content={
                <tbody>
                    <tr>
                        <td>Kode</td>
                        <td className='capitalize'>{ data?.kode ? data?.kode : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Judul</td>
                        <td className='capitalize'>{ data?.title ? data?.title : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Tipe Buku</td>
                        <td className='capitalize'>{ data?.bookType ? data?.bookType : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Publisher</td>
                        <td className='capitalize'>{ data?.publisher ? data?.publisher : 'N/A' }</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td className='flex flex-row flex-wrap gap-1'>
                            { data?.category 
                            ? data?.category?.map((data) => (
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
                            { data?.uploader ? 
                            data?.uploader : 
                            'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td>Tanggal Upload</td>
                        <td className='capitalize'>
                            { data?.publishDate ? formatDate(data?.publishDate) : 'N/A'}
                        </td>
                    </tr>
                </tbody>
            }
            download={
                <button className="btn btn-sm"
                    onClick={() => handleRemove(data?.id, myId)}
                >
                    Remove
                </button>
            }
            clickId={clickId} 
            setClickId={setClickId} 
            redirect={'offline'} 
            data={data} 
        />
    )
}

export default PopupInformation