import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { projectsAPI } from "../services/api";
import { tasksAPI } from '../services/api';
import ProjectForm from "../components/Projects/ProjectForm";
import TaskCard from "../components/Tasks/TaskCard";
import TaskDetails from "../components/Tasks/TaskDetails";
import Pagination from "../components/UI/Pagination";
import SearchSortControls from "../components/UI/SearchSortControls";
import usePagination from "../hooks/usePagination";

const STATUS_BADGES = {
    planned: "badge-error",
    ongoing: "badge-warning",
    completed: "badge-success",
    paused: "badge-info",
    cancelled: "badge-accent",
    archived: "badge-ghost",
};

const DEADLINE_BADGES = {
    planned: { label: "Upcoming", badgeCls: "badge-error", icon: "fa-triangle-exclamation" },
    ongoing: { label: "Important", badgeCls: "badge-warning", icon: "fa-triangle-exclamation" },
    paused: { label: "On Hold", badgeCls: "badge-info", icon: "fa-circle-pause" },
    completed: { label: "Closed", badgeCls: "badge-success", icon: "fa-circle-check" },
    cancelled: { label: "Cancelled", badgeCls: "badge-accent", icon: "fa-ban" },
    archived: { label: "Archived", badgeCls: "badge-ghost", icon: "fa-box-archive" },
};

const SORT_OPTIONS = [
    { value: "priority_asc", label: "Priority (High first)" },
    { value: "priority_desc", label: "Priority (Low first)" },
    { value: "due_date_asc", label: "Due Date (Asc)" },
    { value: "due_date_desc", label: "Due Date (Desc)" },
    { value: "name_asc", label: "Name (A→Z)" },
    { value: "name_desc", label: "Name (Z→A)" },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function getDeadlineBadge(status) {
    return DEADLINE_BADGES[status] ?? { label: "Important", badgeCls: "badge-secondary", icon: "fa-triangle-exclamation" };
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

function ColumnContent({ tasks, emptyState, pageSize = 6, onTaskClick }) {
    const { page, setPage, totalPages, paginated } = usePagination(tasks, pageSize);

    if (tasks.length === 0) return emptyState;

    return (
        <div className="flex flex-col gap-2">
            {paginated.map(task => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => {
                        onTaskClick(task);
                        document.getElementById("task_details").showModal();
                    }}
                />
            ))}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
    );
}

function ProjectDetails() {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("priority_asc");
    const [activeColumn, setActiveColumn] = useState("planned");
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();

    const fetchProjectDetails = async () => {
        try {
            const [projectRes, tasksRes] = await Promise.all([
                projectsAPI.getBySlug(slug),
                tasksAPI.getByProject(slug),
            ]);
            setData(projectRes.data);
            setTasks(tasksRes.data);
            document.title = `MOMENTUM | ${projectRes.data.project_name}`;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [slug]);

    const handleDelete = async () => {
        try {
            await projectsAPI.delete(data.slug);
            navigate("/projects/");
        } catch (err) {
            console.error(err.response?.data);
        }
    };

    const sortTasks = (taskList) => {
        return [...taskList].sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.task_name.localeCompare(b.task_name);
                case "name_desc": return b.task_name.localeCompare(a.task_name);
                case "priority_asc": return (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
                case "priority_desc": return (PRIORITY_ORDER[b.priority] ?? 99) - (PRIORITY_ORDER[a.priority] ?? 99);
                case "due_date_asc":
                    if (!a.due_date) return 1;
                    if (!b.due_date) return -1;
                    return new Date(a.due_date) - new Date(b.due_date);
                case "due_date_desc":
                    if (!a.due_date) return 1;
                    if (!b.due_date) return -1;
                    return new Date(b.due_date) - new Date(a.due_date);
                default: return 0;
            }
        });
    };

    const filtered = sortTasks(
        tasks.filter(t =>
            t.task_name.toLowerCase().includes(search.toLowerCase()) ||
            (t.priority ?? "").toLowerCase().includes(search.toLowerCase())
        )
    );

    const tasksByStatus = { planned: [], ongoing: [], completed: [] };
    filtered.forEach(task => tasksByStatus[task.status?.toLowerCase()]?.push(task));

    const columns = [
        { key: "planned", label: "Planned", tasks: tasksByStatus.planned },
        { key: "ongoing", label: "Ongoing", tasks: tasksByStatus.ongoing },
        { key: "completed", label: "Completed", tasks: tasksByStatus.completed },
    ];

    const activeTasks = columns.find(c => c.key === activeColumn) ?? columns[0];

    const emptyState = (
        <div className="group flex flex-col items-center justify-center h-48 hover:bg-primary/75 border-3 border-dashed border-secondary rounded-lg transition-color duration-150 ease-in-out p-4">
            <i className="fas fa-clipboard-list text-5xl mb-3 transition-transform duration-200 group-hover:scale-110" />
            <p className="text-lg font-semibold">No tasks found</p>
            <p className="text-sm text-center">No tasks match your search</p>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg" />
        </div>
    );

    if (error) return (
        <div className="p-8">
            <div className="alert alert-error"><span>Error: {error}</span></div>
        </div>
    );

    return (
        <>
            <div className='border border-secondary px-4 rounded-lg w-full mb-4'>
                <div className="breadcrumbs w-full text-xs sm:text-sm">
                    <ul>
                        <li className='text-secondary'>
                            <span className='hidden sm:inline'>
                                <i className='fas fa-tv me-2'></i>
                            </span>
                            <Link to="/">Dashboard</Link>
                        </li>
                        <li className='text-secondary'>
                            <span className='hidden sm:inline'>
                                <i className='fas fa-folder-open me-2'></i>
                            </span>
                            <Link to="/projects/">Projects</Link>
                        </li>
                        <li>
                            <span className='hidden sm:inline'>
                                <i className='fas fa-file me-2'></i>
                            </span>
                            {data.project_name}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Hero */}
            <div className="relative h-48 sm:h-96 w-full">
                <img
                    src={`/covers/${data.cover_image ?? 'default'}.jpg`}
                    alt={data.project_name}
                    className="w-full h-full object-cover rounded-lg sm:rounded-4xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-lg sm:rounded-4xl" />

                {/* Desktop: full buttons — top-right */}
                <div className="hidden sm:flex absolute top-4 right-4 gap-2 z-10">
                    <button
                        className="btn btn-sm btn-secondary btn-soft"
                        onClick={() => document.getElementById("project_form").showModal()}
                    >
                        <i className="fas fa-pen-to-square text-xs" /> EDIT
                    </button>
                    <button
                        className="btn btn-sm btn-error btn-soft"
                        onClick={() => document.getElementById("delete_modal").showModal()}
                    >
                        <i className="fas fa-trash text-xs" /> DELETE
                    </button>
                </div>

                {/* Mobile: dropdown — top-right */}
                <div className="dropdown dropdown-end sm:hidden absolute top-4 right-4 z-10">
                    <button tabIndex={0} className="btn btn-sm btn-secondary btn-soft btn-circle p-1">
                        <i className="fas fa-ellipsis-vertical" />
                    </button>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-lg shadow-lg z-20 w-32 p-1 mt-1">
                        <li>
                            <button onClick={() => document.getElementById("project_form").showModal()}>
                                <i className="fas fa-pen-to-square text-xs" /> EDIT
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-error"
                                onClick={() => document.getElementById("delete_modal").showModal()}
                            >
                                <i className="fas fa-trash text-xs" /> DELETE
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2">

                {/* Main card */}
                <div className="relative -mt-16 sm:-mt-32 z-10">
                    <div className="absolute inset-0 bg-base-100 rounded-2xl shadow-xl" />
                    <div className="relative card bg-secondary/25">
                        <div className="card-body p-4 sm:p-8 gap-0">
                            <div className='flex items-center justify-betweem'>
                                <p className="text-xs sm:text-sm uppercase tracking-widest font-medium">
                                    {data.project_type}
                                </p>
                                <span className={`badge badge-xs sm:badge-md font-semibold shrink-0 ${STATUS_BADGES[data.status] ?? 'badge-ghost'}`}>
                                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                </span>
                            </div>

                            <h1 className="text-xl sm:text-4xl font-bold leading-tight">
                                {data.project_name}
                            </h1>

                            <div className="divider my-2 before:bg-neutral-content after:bg-neutral-content" />

                            {data.description && (
                                <p className="text-sm sm:text-base leading-relaxed text-base-content mb-4">
                                    {data.description}
                                </p>
                            )}

                            {data.deadline && (() => {
                                const { label, badgeCls, icon } = getDeadlineBadge(data.status);
                                return (
                                    <div className="bg-secondary text-secondary-content rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap mb-2">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest">Deadline</p>
                                            <p className="text-lg sm:text-2xl font-bold">{formatDate(data.deadline)}</p>
                                        </div>
                                        <span className={`badge badge-soft font-semibold uppercase gap-2 ${badgeCls}`}>
                                            <i className={`fa-solid ${icon} text-[10px]`} /> {label}
                                        </span>
                                    </div>
                                );
                            })()}

                            {/* Meta grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <MetaCard icon="fa-calendar" label="Created" dateStr={data.created_at} />
                                <MetaCard icon="fa-clock" label="Last Updated" dateStr={data.updated_at} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks Kanban */}
            <div className="max-w-7xl mx-auto px-2">
                <div className="relative mt-4">
                    <div className="absolute inset-0 bg-base-100 rounded-2xl shadow-xl" />
                    <div className="relative card bg-secondary/25">
                        <div className="card-body p-4 sm:p-8 gap-4">
                            <SearchSortControls
                                search={search}
                                onSearchChange={setSearch}
                                searchPlaceholder="Search tasks..."
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                sortOptions={SORT_OPTIONS}
                                onNew={() => { }}
                                newLabel="NEW TASK"
                            />

                            {/* Mobile: column selector */}
                            <div className="sm:hidden mb-4">
                                <select
                                    className="select select-bordered select-lg select-primary w-full font-bold"
                                    value={activeColumn}
                                    onChange={e => setActiveColumn(e.target.value)}
                                >
                                    {columns.map(({ key, label, tasks }) => (
                                        <option key={key} value={key}>
                                            {label.toUpperCase()} ({tasks.length})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mobile: active column content */}
                            <div className="sm:hidden">
                                <ColumnContent
                                    tasks={activeTasks.tasks}
                                    emptyState={emptyState}
                                    onTaskClick={setSelectedTask}
                                />
                            </div>

                            {/* Desktop: three columns */}
                            <div className="hidden sm:grid grid-cols-3 gap-4">
                                {columns.map(({ key, label, tasks }) => (
                                    <div key={key} className="flex flex-col gap-2">
                                        <div className="bg-base-100 rounded-lg p-4 flex items-center gap-2">
                                            <h2 className="font-semibold text-xl uppercase tracking-widest">{label}</h2>
                                            <span className="badge badge-info badge-xs font-semibold">{tasks.length}</span>
                                        </div>
                                        <div className="bg-base-100 p-2 rounded-lg flex flex-col gap-2">
                                            <ColumnContent
                                                tasks={tasks}
                                                emptyState={emptyState}
                                                onTaskClick={setSelectedTask}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <ProjectForm
                header="UPDATE PROJECT"
                project={data}
                onSuccess={fetchProjectDetails}
            />

            <TaskDetails task={selectedTask} />

            {/* Delete confirmation */}
            <dialog id="delete_modal" className="modal modal-top sm:modal-middle">
                <div className="modal-box bg-neutral">
                    <h3 className="font-bold text-lg">Delete Project?</h3>
                    <p className="text-sm text-base-content/60 mt-1">
                        <span className="font-semibold text-base-content">{data.project_name}</span> will be permanently deleted. This cannot be undone.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost">CANCEL</button>
                        </form>
                        <button className="btn btn-error" onClick={handleDelete}>
                            <i className="fas fa-trash text-xs" /> DELETE
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}

export default ProjectDetails;