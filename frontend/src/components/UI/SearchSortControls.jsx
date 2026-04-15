function SearchSortControls({
    search,
    onSearchChange,
    searchPlaceholder = "Search...",
    sortBy,
    onSortChange,
    sortOptions = [],
    onNew,
    newLabel = "NEW",
}) {
    const activeSortLabel = sortOptions.find(o => o.value === sortBy)?.label;
    return (
        <div className="flex gap-2 mb-4 items-center">
            <label className="flex flex-1 items-center gap-2 h-12 px-4 bg-base-100 rounded-lg border border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary transition-all min-w-0">
                <i className="fas fa-search text-base-content/30 text-sm shrink-0" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="flex-1 bg-transparent outline-none text-sm min-w-0"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                />
                {search && (
                    <button
                        className="text-base-content/30 hover:text-base-content/60 transition-colors shrink-0"
                        onClick={() => onSearchChange("")}
                    >
                        <i className="fas fa-times text-xs" />
                    </button>
                )}
            </label>

            {sortOptions.length > 0 && (
                <div className="dropdown dropdown-end shrink-0">
                    <button
                        tabIndex={0}
                        className="btn h-12 min-h-0 px-4 text-sm font-medium rounded-lg"
                    >
                        <i className="fas fa-arrow-down-wide-short text-xs" />
                        <span className="hidden sm:inline">
                            {activeSortLabel}
                            <i className="fas fa-chevron-down text-base-content/50 text-[10px] ml-1" />
                        </span>
                    </button>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-lg shadow-lg border border-base-content/10 w-44 p-1 z-10 mt-1"
                    >
                        {sortOptions.map(opt => (
                            <li key={opt.value}>
                                <button
                                    className={`flex items-center justify-between rounded-lg text-sm ${sortBy === opt.value ? "active font-semibold" : ""}`}
                                    onClick={() => onSortChange(opt.value)}
                                >
                                    {opt.label}
                                    {sortBy === opt.value && <i className="fas fa-check text-xs" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {onNew && (
                <button
                    className="btn btn-primary h-12 min-h-0 px-4 text-sm font-semibold rounded-lg shrink-0"
                    onClick={onNew}
                >
                    <i className="fas fa-plus text-xs" />
                    <span className="hidden sm:inline">{newLabel}</span>
                </button>
            )}
        </div>
    );
}

export default SearchSortControls;