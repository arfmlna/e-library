import { ArrowBigLeftDash, Eye, EyeClosed } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LayoutReader({
    currentPage,
    numPages,
    children,
    showTools,
    setShowTools
}) {
    const navigate = useNavigate()

    const handleShowTools = () => {
        setShowTools(!showTools)
    }

    return (
        <div className="w-full overflow-hidden relative select-none">
            { showTools && (
                <>
                    <div className="fixed top-3 left-3 z-10">
                        <button 
                            className="p-2.5 border-2 border-black bg-white backdrop-blur-sm text-black text-xs shadow-lg rounded-md transition-all"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowBigLeftDash size={20} />
                        </button>
                    </div>
                    <div className="p-2.5 fixed top-3 right-3 border-2 border-black bg-white backdrop-blur-sm text-black text-[8px] font-black rounded-md pointer-events-none tracking-wider z-10">
                        {currentPage} / {numPages}
                    </div>
                </>
            ) }
            <button className="p-2.5 fixed top-15 right-3 border-2 border-black bg-white backdrop-blur-sm text-black text-xs rounded-md tracking-wider z-10"
            onClick={handleShowTools}>
                {showTools ? <Eye size={20}/> : <EyeClosed size={20}/>}
            </button>
            { children }
        </div>
    )
}
