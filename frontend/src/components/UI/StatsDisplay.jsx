function StatsDisplay({ stats, variant = "horizontal" }) {
    if (variant === "grid") {
        return (
            <div className="grid grid-cols-2 gap-3 text-white">
                {stats.map(({ title, value, desc, icon, color, valueColor }) => (
                    <div key={title} className="bg-base-200 rounded-xl p-4 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-base-content uppercase tracking-wide">{title}</span>
                            <i className={`fas ${icon} text-sm ${color}`} />
                        </div>
                        <div className={`text-2xl font-bold ${valueColor ?? ""}`}>{value}</div>
                        <div className="text-xs text-base-content">{desc}</div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="stats stats-horizontal w-full">
            {stats.map(({ title, value, desc, icon, color, valueColor }) => (
                <div key={title} className="stat">
                    <div className={`stat-figure ${color}`}>
                        <i className={`fas ${icon} text-2xl`} />
                    </div>
                    <div className="stat-title text-black">{title}</div>
                    <div className={`stat-value ${valueColor ?? ""}`}>{value}</div>
                    <div className="stat-desc text-black">{desc}</div>
                </div>
            ))}
        </div>
    );
}

export default StatsDisplay;