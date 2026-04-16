import { Link } from 'react-router-dom';

const STATUS_BADGES = {
    planned: "badge-error",
    ongoing: "badge-warning",
    completed: "badge-success",
};

const PRIORITY_BADGES = {
    high: "badge-error",
    medium: "badge-warning",
    low: "badge-success",
};

const DUE_DATE_BADGES = {
    planned: { label: "Upcoming", badgeCls: "badge-error", icon: "fa-triangle-exclamation" },
    ongoing: { label: "Important", badgeCls: "badge-warning", icon: "fa-triangle-exclamation" },
    completed: { label: "Closed", badgeCls: "badge-success", icon: "fa-circle-check" },
};

function getDueDateBadge(status) {
    return DUE_DATE_BADGES[status] ?? { label: "Important", badgeCls: "badge-secondary", icon: "fa-triangle-exclamation" };
}

function formatDate(dateStr, includeTime = false) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
    });
}

function formatTime(dateStr) {
    return formatDate(dateStr, true).split('at')[1]?.trim();
}

function MetaCard({ icon, label, dateStr }) {
    return (
        <div className="bg-base-100 rounded-lg p-4 space-y-1">
            <p className="text-xs text-base-content uppercase tracking-wide">
                <i className={`fa-regular ${icon} me-2`} />{label}
            </p>
            <p className="font-semibold text-sm sm:text-base">{formatDate(dateStr)}</p>
            <p className="text-xs text-base-content">{formatTime(dateStr)}</p>
        </div>
    );
}

function TaskDetails({ task }) {
    return (
        <dialog id="task_details" className="modal modal-top sm:modal-middle">
            <div className="modal-box bg-neutral max-w-2xl">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-2xl">TASK DETAILS</h1>

                    <div className="dropdown dropdown-end absolute top-4 right-4 z-10">
                        <button tabIndex={-1} className="btn btn-ghost btn-circle p-1">
                            <i className="fas fa-ellipsis-vertical" />
                        </button>
                        <ul className="dropdown-content menu bg-base-100 rounded-lg shadow-lg z-20 w-32 p-1 mt-1">
                            <li>
                                <button className="font-semibold">
                                    <i className="fas fa-pen-to-square text-xs" /> EDIT
                                </button>
                            </li>
                            <li>
                                <button className="text-error font-semibold">
                                    <i className="fas fa-trash text-xs" /> DELETE
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="divider my-2 before:bg-neutral-content after:bg-neutral-content" />

                <h1 className="text-xl sm:text-4xl font-bold leading-tight mb-2">
                    {task?.task_name}
                </h1>

                <div className="flex items-center justify-between">
                    {task?.project_name && (
                        <p className="text-xs sm:text-base font-medium text-secondary">
                            <i className="fas fa-folder me-1"></i>
                            <Link to={`/projects/${task.project_slug}`} className='hover:underline'>
                                {task.project_name}
                            </Link>
                        </p>
                    )}
                    <div className="space-x-2">
                        <span className={`badge badge-xs sm:badge-md font-semibold uppercase ${PRIORITY_BADGES[task?.priority] ?? "badge-ghost"}`}>
                            <i className="fas fa-flag text-[10px]"></i>
                            {task?.priority
                                ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                                : "—"}
                        </span>
                        <span className={`badge badge-xs sm:badge-md badge-soft font-semibold uppercase ${STATUS_BADGES[task?.status] ?? "badge-ghost"}`}>
                            <i className="fas fa-circle text-[10px]"></i>
                            {task?.status
                                ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
                                : "—"}
                        </span>
                    </div>
                </div>

                <div className="divider my-2 before:bg-neutral-content after:bg-neutral-content" />

                {task?.description && (
                    <p className="text-sm sm:text-base leading-relaxed text-base-content mb-4">
                        {task.description}
                    </p>
                )}

                {task?.due_date && (() => {
                    const { label, badgeCls, icon } = getDueDateBadge(task.status);
                    return (
                        <div className="bg-secondary text-secondary-content rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap mb-2">
                            <div>
                                <p className="text-xs uppercase tracking-widest">Due Date</p>
                                <p className="text-lg sm:text-2xl font-bold">{formatDate(task.due_date)}</p>
                            </div>
                            <span className={`badge badge-soft font-semibold uppercase gap-2 ${badgeCls}`}>
                                <i className={`fa-solid ${icon} text-[10px]`} /> {label}
                            </span>
                        </div>
                    );
                })()}

                <div className="grid grid-cols-2 gap-2">
                    <MetaCard icon="fa-calendar" label="Created" dateStr={task?.created_at} />
                    <MetaCard icon="fa-clock" label="Last Updated" dateStr={task?.updated_at} />
                </div>

                {/* <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div> */}
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}

export default TaskDetails;