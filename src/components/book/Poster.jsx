import BookPoster from "../ui/CardBook/Poster";
import { pb } from "@/utils/pocketbase";

const Poster = ({data, height, width}) => {
    
    const isPoster = data.posterUrl ? data?.posterUrl : data?.poster ? data?.poster : data?.pdfUrl ? data?.pdfUrl : data?.pdfFile
    const posterUrl = pb.files.getURL(data, isPoster)

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