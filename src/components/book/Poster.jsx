import { useMemo } from "react";
import BookPoster from "../ui/CardBook/Poster";
import { pb } from "@/utils/pocketbase";

const Poster = ({data, height, width}) => {
    const posterUrl = useMemo(() => {
        const isPoster = data.poster ? data?.poster : data?.pdfFile
        const posterUrl = pb.files.getURL(data, isPoster)
        return posterUrl;
    }, [data.poster, data?.pdfFile, data.collectionId, data.id])

    return (
        <BookPoster 
            data={data} 
            posterUrl={posterUrl} 
            height={height} 
            widht={width}
        />
    )
}

export default Poster