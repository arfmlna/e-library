export default function PaginationBook({ books, setPage, refreshData }) {
  return (
    <div className="flex flex-col items-center gap-2 my-4">
        <div className="join">
            <button 
            className="join-item btn btn-sm"
            disabled={books?.page <= 1}
            onClick={() => {
                setPage(books?.page - 1)
                refreshData()
            }}
            >
                « Prev
            </button>
            
            <button className="join-item btn btn-sm no-animation">
                Halaman {books?.page} dari {books?.totalPages}
            </button>
            
            <button 
            className="join-item btn btn-sm"
            disabled={books?.page >= books?.totalPages}
            onClick={() => {
                setPage(books?.page + 1)
                refreshData()
            }}
            >
                Next »
            </button>
        </div>
    </div>
  )
}
