import BookPoster from "@/components/ui/CardBook/Poster";
import { useEffect, useState } from "react";

const Poster = ({data, width, height}) => {
    const [posterUrl, setPosterUrl] = useState(null);

    useEffect(() => {
        const blobFileUrl = data?.posterUrl || data?.pdfUrl || null;
        setPosterUrl(blobFileUrl);
    }, [data?.posterUrl, data?.pdfUrl]);

    return (
        <BookPoster
            data={data}
            posterUrl={posterUrl}
            widht={width}
            height={height}
        />
    )
}

export default Poster