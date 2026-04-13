function StatsDisplay({ stats }) {
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