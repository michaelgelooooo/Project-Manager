function Pagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, "...", totalPages];
        if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", page, "...", totalPages];
    };

    return (
        <div className="flex justify-center">
            <div className="join">

                <button
                    className="join-item btn btn-sm btn-ghost"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    <i className="fas fa-chevron-left text-[10px]" />
                </button>

                {getPages().map((n, i) =>
                    n === "..." ? (
                        <button key={`ellipsis-${i}`} className="join-item btn btn-sm btn-ghost btn-disabled pointer-events-none">
                            ···
                        </button>
                    ) : (
                        <button
                            key={n}
                            className={`join-item btn btn-sm ${page === n ? "btn-primary" : "btn-ghost"}`}
                            onClick={() => setPage(n)}
                        >
                            {n}
                        </button>
                    )
                )}

                <button
                    className="join-item btn btn-sm btn-ghost"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    <i className="fas fa-chevron-right text-[10px]" />
                </button>

            </div>
        </div>
    );
}

export default Pagination;