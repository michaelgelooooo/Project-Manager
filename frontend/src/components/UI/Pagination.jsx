function Pagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center mt-4">
            <div className="join">
                <button
                    className="join-item btn btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    <i className="fas fa-chevron-left text-xs" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                        key={n}
                        className={`join-item btn btn-sm ${page === n ? "btn-active" : ""}`}
                        onClick={() => setPage(n)}
                    >
                        {n}
                    </button>
                ))}
                <button
                    className="join-item btn btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    <i className="fas fa-chevron-right text-xs" />
                </button>
            </div>
        </div>
    );
}

export default Pagination;