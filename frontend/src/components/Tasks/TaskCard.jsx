function TaskCard({ task }) {
    const priorityStyles = {
        high: 'badge-error',
        medium: 'badge-warning',
        low: 'badge-success',
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });

    return (
        <div className="relative h-full hover:scale-101 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer">
            {/* Background card */}
            <div className="absolute inset-0 bg-base-100 rounded-lg shadow-xl" />
            {/* Foreground card */}
            <div className="relative card h-full bg-secondary/25 rounded-lg hover:bg-primary/75">
                <div className="card-body p-4 flex flex-col gap-2">
                    {/* Row 1: Name + Priority badge */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="card-title text-lg leading-tight">{task.task_name}</div>
                        <span className={`badge text-sm font-semibold capitalize shrink-0 ${priorityStyles[task.priority] || 'badge-ghost'}`}>
                            <i className="fas fa-flag text-[10px]" />
                            {task.priority}
                        </span>
                    </div>
                    {/* Row 2: Project name + Due date */}
                    <div className="flex items-center justify-between gap-2 text-sm text-base-content">
                        <div className="flex items-center gap-1 min-w-0">
                            <i className="fas fa-folder text-[10px] shrink-0" />
                            <span className="truncate">{task.project_name ?? '—'}</span>
                        </div>
                        {task.due_date ? (
                            <span className="badge badge-error badge-soft gap-1 font-semibold shrink-0">
                                <i className="fas fa-calendar-day text-[10px]" />
                                {formatDate(task.due_date)}
                            </span>
                        ) : (
                            <span className="badge badge-neutral gap-1 font-semibold shrink-0">
                                <i className="fas fa-calendar-xmark text-[10px]" />
                                No Due Date
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;