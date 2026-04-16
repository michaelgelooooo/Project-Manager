import { useEffect, useState } from "react";
import { tasksAPI } from "../services/api";
import TaskCard from "../components/Tasks/TaskCard";
import TaskDetails from "../components/Tasks/TaskDetails";
import Pagination from "../components/UI/Pagination";
import SearchSortControls from "../components/UI/SearchSortControls";
import StatsDisplay from "../components/UI/StatsDisplay";
import usePagination from "../hooks/usePagination";

const SORT_OPTIONS = [
    { value: "priority_asc", label: "Priority (High first)" },
    { value: "priority_desc", label: "Priority (Low first)" },
    { value: "due_date_asc", label: "Due Date (Asc)" },
    { value: "due_date_desc", label: "Due Date (Desc)" },
    { value: "name_asc", label: "Name (A→Z)" },
    { value: "name_desc", label: "Name (Z→A)" },
    { value: "project_asc", label: "Project (A→Z)" },
    { value: "project_desc", label: "Project (Z→A)" },
];

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

function Tasks() {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("priority_asc");
    const [activeColumn, setActiveColumn] = useState("planned");
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchData = async () => {
        try {
            const [taskRes, statsRes] = await Promise.all([
                tasksAPI.getAll(),
                tasksAPI.getStats(),
            ]);
            setData(taskRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        document.title = "MOMENTUM | Tasks";
        fetchData();
    }, []);

    const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

    const sortTasks = (tasks) => {
        return [...tasks].sort((a, b) => {
            switch (sortBy) {
                case "updated": return new Date(b.updated_at) - new Date(a.updated_at);
                case "name_asc": return a.task_name.localeCompare(b.task_name);
                case "name_desc": return b.task_name.localeCompare(a.task_name);
                case "priority_asc": return (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
                case "priority_desc": return (PRIORITY_ORDER[b.priority] ?? 99) - (PRIORITY_ORDER[a.priority] ?? 99);
                case "project_asc": return (a.project_name ?? "").localeCompare(b.project_name ?? "");
                case "project_desc": return (b.project_name ?? "").localeCompare(a.project_name ?? "");
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
        data.filter(t =>
            t.task_name.toLowerCase().includes(search.toLowerCase()) ||
            t.project_name.toLowerCase().includes(search.toLowerCase()) ||
            t.priority.toLowerCase().includes(search.toLowerCase())
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

    const taskStats = [
        { title: "Active", value: stats?.active ?? "—", desc: "Planned & Ongoing", icon: "fa-folder-open", color: "text-primary" },
        { title: "Completed", value: stats?.completed ?? "—", desc: "All Time", icon: "fa-circle-check", color: "text-success" },
        { title: "Completion Rate", value: stats ? `${stats.completion_rate}%` : "—", desc: "All Time", icon: "fa-chart-pie", color: "text-info" },
        { title: "Overdue", value: stats?.overdue ?? "—", desc: "Needs Attention", icon: "fa-circle-exclamation", color: "text-red-600" },
        { title: "Due This Week", value: stats?.due_this_week ?? "—", desc: "Active Projects", icon: "fa-calendar-week", color: "text-warning" },
        { title: "Due This Month", value: stats?.due_this_month ?? "—", desc: "Active Projects", icon: "fa-calendar-days", color: "text-accent" },
    ];

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

    const emptyState = (
        <div className="group flex flex-col items-center justify-center h-64 hover:bg-primary/75 border-3 border-dashed border-secondary rounded-lg transition-color duration-150 ease-in-out p-4">
            <i className="fas fa-clipboard-list text-6xl mb-4 transition-transform duration-200 group-hover:scale-110" />
            <p className="text-xl font-semibold">No tasks found</p>
            <p className="text-base text-center">No tasks match your search</p>
        </div>
    );

    return (
        <>
            <div className="sm:hidden mb-4">
                <button
                    className="btn bg-secondary/75 text-secondary-content w-full"
                    onClick={() => document.getElementById("stats_modal").showModal()}
                >
                    <i className="fas fa-chart-pie text-xs" />
                    VIEW TASK STATISTICS
                </button>
                <dialog
                    id="stats_modal"
                    className="modal modal-top"
                    onClick={e => e.target === e.currentTarget && e.currentTarget.close()}
                >
                    <div className="modal-box bg-secondary text-secondary-content">
                        <h3 className="font-bold text-lg mb-4">TASK STATISTICS</h3>
                        <StatsDisplay stats={taskStats} variant="grid" />
                    </div>
                </dialog>
            </div>

            <div className="hidden sm:block mb-4">
                <div className="collapse collapse-arrow bg-secondary/75 text-secondary-content rounded-lg">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold text-2xl p-4">TASK STATISTICS</div>
                    <div className="collapse-content p-0">
                        <StatsDisplay stats={taskStats} />
                    </div>
                </div>
            </div>

            <div className="bg-secondary/75 p-4 rounded-lg shadow-lg">
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

                {/* Mobile: content */}
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

            <TaskDetails
                task={selectedTask}
            />
        </>
    );
}

export default Tasks;