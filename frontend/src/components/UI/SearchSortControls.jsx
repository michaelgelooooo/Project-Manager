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

            <label className="flex flex-1 items-center gap-2 h-12 px-4 bg-base-100 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary transition-all">
                <i className="fas fa-search text-base-content/30 text-sm" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                />
                {search && (
                    <button
                        className="text-base-content/30 hover:text-base-content/60 transition-colors"
                        onClick={() => onSearchChange("")}
                    >
                        <i className="fas fa-times text-xs" />
                    </button>
                )}
            </label>

            {sortOptions.length > 0 && (
                <div className="dropdown dropdown-end">
                    <button
                        tabIndex={0}
                        className="flex items-center gap-2 h-12 px-4 bg-base-100 border border-base-content/20 rounded-xl text-sm font-medium hover:bg-base-200 hover:border-base-content/30 transition-all"
                    >
                        <i className="fas fa-arrow-down-wide-short text-base-content/50 text-xs" />
                        <span>{activeSortLabel}</span>
                        <i className="fas fa-chevron-down text-base-content/30 text-[10px]" />
                    </button>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-xl shadow-lg border border-base-content/10 w-44 p-1 z-10 mt-1"
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
                    className="flex items-center gap-2 h-12 px-4 bg-primary hover:bg-primary-focus rounded-xl text-primary-content text-sm font-semibold transition-all active:scale-[0.98]"
                    onClick={onNew}
                >
                    <i className="fas fa-plus text-xs" />
                    {newLabel}
                </button>
            )}

        </div>
    );
}

export default SearchSortControls;