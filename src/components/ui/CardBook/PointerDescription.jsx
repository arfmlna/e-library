import { MousePointer2 } from "lucide-react"
import { CursorProvider, Cursor, CursorFollow } from '@/components/animate-ui/components/animate/cursor'

const PointerDescription = ({hoverId, data}) => {
    return (
        <>
            {
                hoverId === data.id && (
                    <CursorProvider global={false}>
                            <Cursor>
                                <MousePointer2 size={25} fill='#000000'  color='#000000' />
                            </Cursor>
                            <CursorFollow 
                                key={data.id}
                                side={'top'}
                                sideOffset={15}
                                align={'center'}
                                alignOffset={5}
                            >
                                <div className="p-2 text-sm rounded-sm bg-black/40 text-white shadow-md shadow-blue-600">
                                    <div>
                                        {data.title}
                                    </div>
                                </div>
                            </CursorFollow>
                    </CursorProvider>
                )
            }
        </>
    )
}

export default PointerDescription