import { useState } from "react";
import BatchUploadBook from "../ebooks/book/BatchUploadBook";

export default function Test() {
    const [show, setShow] = useState(false)
    
    return (
        <div className="px-10">
            <BatchUploadBook show={show} setShow={setShow} />
            <button className="btn btn-neutral btn-sm"
            onClick={() => setShow(true)}>upload</button>
        </div>
    )
}
