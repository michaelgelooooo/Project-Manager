import { useEffect, useState } from "react";

function usePagination(items, pageSize = 10) {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(items.length / pageSize);
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => { setPage(1); }, [items.length]);

    return { page, setPage, totalPages, paginated };
}

export default usePagination;