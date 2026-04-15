function TaskCard({ task }) {
    const priorityStyles = {
        high: 'badge-error',
        medium: 'badge-warning',
        low: 'badge-success',
    };
    const statusStyles = {
        planned: 'badge-error',
        ongoing: 'badge-warning',
    };
    return (
        <div className="relative hover:scale-102 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer">
            {/* Background card */}
            <div className="absolute inset-0 bg-base-100 rounded-lg shadow-xl"></div>

            {/* Foreground card */}
            <div className="relative card bg-secondary/25 rounded-lg hover:bg-primary/75">
                <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="card-title text-base sm:text-lg">{task.task_name}</h3>
                        <div className={`badge badge-xs sm:badge-md uppercase font-semibold ${priorityStyles[task.priority] || 'badge-ghost'}`}>
                            <i className="fas fa-flag text-[10px]"></i>
                            {task.priority}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-base-content">{task.project_name}</p>
                        <div className={`badge badge-xs sm:badge-md badge-soft uppercase font-semibold ${statusStyles[task.status] || 'badge-ghost'}`}>
                            <i className="fas fa-circle text-[10px]"></i>
                            {task.status}
                        </div>
                    </div>
                    {task.due_date && (
                        <p className="text-xs sm:text-sm">
                            <span className="font-semibold">Due:</span>{' '}
                            {new Date(task.due_date).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                weekday: 'short',
                            })}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskCard;