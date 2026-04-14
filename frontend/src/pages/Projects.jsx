import { useEffect, useState } from "react";
import { projectsAPI } from "../services/api";
import ProjectCard from "../components/Projects/ProjectCard";
import Pagination from "../components/UI/Pagination";
import SearchSortControls from "../components/UI/SearchSortControls";
import StatsDisplay from "../components/UI/StatsDisplay";
import usePagination from "../hooks/usePagination";

const SORT_OPTIONS = [
    { value: "updated", label: "Recent" },
    { value: "name_asc", label: "Name ↑" },
    { value: "name_desc", label: "Name ↓" },
    { value: "deadline_asc", label: "Deadline ↑" },
    { value: "deadline_desc", label: "Deadline ↓" },
];

const TAB_KEYS = ["all", "planned", "ongoing", "completed", "paused", "cancelled", "archived"];

function TabContent({ projects, emptyState, pageSize = 8 }) {
    const { page, setPage, totalPages, paginated } = usePagination(projects, pageSize);

    if (projects.length === 0) return emptyState;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:px-2">
                {paginated.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
    );
}

function Projects() {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("updated");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        document.title = "MOMENTUM | Projects";

        const fetchData = async () => {
            try {
                const [projectsRes, statsRes] = await Promise.all([
                    projectsAPI.getAll(),
                    projectsAPI.getStats(),
                ]);
                setData(projectsRes.data);
                setStats(statsRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortProjects = (projects) => {
        return [...projects].sort((a, b) => {
            switch (sortBy) {
                case "updated": return new Date(b.updated_at) - new Date(a.updated_at);
                case "name_asc": return a.project_name.localeCompare(b.project_name);
                case "name_desc": return b.project_name.localeCompare(a.project_name);
                case "deadline_asc":
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                case "deadline_desc":
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(b.deadline) - new Date(a.deadline);
                default: return 0;
            }
        });
    };

    const filtered = sortProjects(
        data.filter(p =>
            p.project_name.toLowerCase().includes(search.toLowerCase()) ||
            p.project_type.toLowerCase().includes(search.toLowerCase())
        )
    );

    const projectByStatus = {
        planned: [], ongoing: [], completed: [],
        paused: [], cancelled: [], archived: [],
    };
    filtered.forEach(p => projectByStatus[p.status]?.push(p));

    const tabs = [
        { key: "all", label: "ALL", projects: filtered },
        { key: "planned", label: "PLANNED", projects: projectByStatus.planned },
        { key: "ongoing", label: "ONGOING", projects: projectByStatus.ongoing },
        { key: "completed", label: "COMPLETED", projects: projectByStatus.completed },
        { key: "paused", label: "PAUSED", projects: projectByStatus.paused },
        { key: "cancelled", label: "CANCELLED", projects: projectByStatus.cancelled },
        { key: "archived", label: "ARCHIVED", projects: projectByStatus.archived },
    ];

    const activeProjects = tabs.find(t => t.key === activeTab)?.projects ?? [];

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
        <div className="group flex flex-col items-center justify-center h-64 hover:bg-primary/75 border-3 border-dashed border-secondary rounded-xl transition-color duration-150 ease-in-out p-4">
            <i className="fas fa-folder-open text-6xl mb-4 transition-transform duration-200 group-hover:scale-110" />
            <p className="text-xl font-semibold">No projects found</p>
            <p className="text-base text-center">No projects match your search</p>
        </div>
    );

    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const projectStats = [
        { title: "Active", value: stats?.active ?? "—", desc: "Planned & Ongoing", icon: "fa-folder-open", color: "text-primary" },
        { title: "Completed", value: stats?.completed_this_month ?? "—", desc: "This Month", icon: "fa-circle-check", color: "text-success" },
        { title: "Completion Rate", value: stats ? `${stats.completion_rate}%` : "—", desc: currentMonth, icon: "fa-chart-pie", color: "text-info" },
        { title: "Due This Week", value: stats?.due_this_week ?? "—", desc: "Active Projects", icon: "fa-calendar-week", color: "text-warning" },
        { title: "Due This Month", value: stats?.due_this_month ?? "—", desc: "Active Projects", icon: "fa-calendar-days", color: "text-accent" },
        { title: "Overdue", value: stats?.overdue ?? "—", desc: "Needs Attention", icon: "fa-circle-exclamation", color: "text-red-600" },
    ];

    return (
        <div className="flex flex-col gap-4">

            {/* Mobile: stats button + modal */}
            <div className="sm:hidden">
                <button
                    className="btn bg-secondary/75 text-secondary-content w-full"
                    onClick={() => document.getElementById("stats_modal").showModal()}
                >
                    <i className="fas fa-chart-pie text-xs" />
                    VIEW MONTHLY OVERVIEW
                </button>
                <dialog
                    id="stats_modal"
                    className="modal modal-bottom"
                    onClick={e => e.target === e.currentTarget && e.currentTarget.close()}
                >
                    <div className="modal-box bg-secondary text-secondary-content">
                        <h3 className="font-bold text-lg mb-4">Monthly Project Overview</h3>
                        <StatsDisplay stats={projectStats} variant="grid" />
                    </div>
                </dialog>
            </div>

            {/* Desktop: collapse */}
            <div className="hidden sm:block">
                <div className="collapse collapse-arrow bg-secondary/75 text-secondary-content">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title font-semibold">MONTHLY PROJECT OVERVIEW</div>
                    <div className="collapse-content p-0">
                        <StatsDisplay stats={projectStats} />
                    </div>
                </div>
            </div>

            <div className="bg-secondary/75 p-4 rounded-xl shadow-lg">
                <SearchSortControls
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search projects..."
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOptions={SORT_OPTIONS}
                    onNew={() => {/* open modal / navigate */ }}
                    newLabel="NEW PROJECT"
                />

                {/* Mobile: select */}
                <div className="sm:hidden mb-4">
                    <select
                        className="select select-bordered select-lg select-primary w-full font-bold"
                        value={activeTab}
                        onChange={e => setActiveTab(e.target.value)}
                    >
                        {tabs.map(({ key, label, projects }) => (
                            <option key={key} value={key}>
                                {label} ({projects.length})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mobile: content */}
                <div className="sm:hidden">
                    <TabContent projects={activeProjects} emptyState={emptyState} pageSize={4} />
                </div>

                {/* Desktop: tabs */}
                <div className="hidden sm:block">
                    <div className="tabs tabs-lift tabs-xl">
                        {tabs.map(({ key, label, projects }, i) => (
                            <>
                                <label key={`tab-${key}`} className="tab font-bold me-1 [&:not(:has(input:checked))]:bg-base-100/75 rounded-t-xl w-45">
                                    <input
                                        type="radio"
                                        name="project_tabs"
                                        defaultChecked={i === 0}
                                    />
                                    {label}
                                    <span className="badge badge-xs badge-info ms-2">{projects.length}</span>
                                </label>
                                <div key={`content-${key}`} className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-4">
                                    <TabContent projects={projects} emptyState={emptyState} />
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Projects;