import { useEffect, useState } from "react";
import { projectsAPI } from "../services/api";
import ProjectCard from "../components/Projects/ProjectCard";
import Pagination from "../components/UI/Pagination";
import usePagination from "../hooks/usePagination";

function TabContent({ projects, emptyState }) {
    const { page, setPage, totalPages, paginated } = usePagination(projects);

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("updated");

    useEffect(() => {
        document.title = 'MOMENTUM | Projects';

        const fetchProjects = async () => {
            try {
                const response = await projectsAPI.getAll();
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const sortOptions = [
        { value: "updated",       label: "Recent" },
        { value: "name_asc",      label: "Name ↑" },
        { value: "name_desc",     label: "Name ↓" },
        { value: "deadline_asc",  label: "Deadline ↑" },
        { value: "deadline_desc", label: "Deadline ↓" },
    ];

    const sortProjects = (projects) => {
        return [...projects].sort((a, b) => {
            switch (sortBy) {
                case "updated":
                    return new Date(b.updated_at) - new Date(a.updated_at);
                case "name_asc":
                    return a.project_name.localeCompare(b.project_name);
                case "name_desc":
                    return b.project_name.localeCompare(a.project_name);
                case "deadline_asc":
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                case "deadline_desc":
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(b.deadline) - new Date(a.deadline);
                default:
                    return 0;
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
        planned: [],
        ongoing: [],
        completed: [],
        paused: [],
        cancelled: [],
        archived: [],
    };

    filtered.forEach(project => {
        projectByStatus[project.status]?.push(project);
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="alert alert-error">
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    const emptyState = (
        <div className="group flex flex-col items-center justify-center h-64 bg-secondary/25 hover:bg-primary/75 border-3 border-dashed border-secondary rounded-xl transition-color duration-150 ease-in-out p-4">
            <i className="fas fa-folder-open text-6xl mb-4 transition-transform duration-200 group-hover:scale-110"></i>
            <p className="text-xl font-semibold">No projects found</p>
            <p className="text-base text-center">No projects match your search</p>
        </div>
    );

    const activeSortLabel = sortOptions.find(o => o.value === sortBy)?.label;

    return (
        <div>
            <div className="bg-secondary/50 p-4 rounded-xl shadow-lg">
                <div className="flex gap-2 mb-4">
                    <label className="input input-lg flex-1">
                        <i className="fas fa-search text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </label>

                    <div className="dropdown dropdown-end">
                        <button
                            tabIndex={0}
                            className="btn btn-lg gap-2 w-40"
                        >
                            <i className="fas fa-arrow-up-wide-short" />
                            <span className="text-sm">{activeSortLabel}</span>
                        </button>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-xl shadow-lg border border-base-content/10 w-48 p-1 z-10"
                        >
                            {sortOptions.map(opt => (
                                <li key={opt.value}>
                                    <button
                                        className={`flex items-center justify-between rounded-lg ${sortBy === opt.value ? "active font-semibold" : ""}`}
                                        onClick={() => setSortBy(opt.value)}
                                    >
                                        {opt.label}
                                        {sortBy === opt.value && <i className="fas fa-check text-xs" />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="btn btn-primary btn-lg gap-2">
                        <i className="fas fa-plus" />
                        <span className="font-bold">NEW</span>
                    </button>
                </div>

                <div className="tabs tabs-lift tabs-xl">
                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="ALL" defaultChecked />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        <TabContent projects={filtered} emptyState={emptyState} />
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="PLANNED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        <TabContent projects={projectByStatus.planned} emptyState={emptyState} />
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="ONGOING" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        <TabContent projects={projectByStatus.ongoing} emptyState={emptyState} />
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="COMPLETED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        <TabContent projects={projectByStatus.completed} emptyState={emptyState} />
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="PAUSED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        <TabContent projects={projectByStatus.paused} emptyState={emptyState} />
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="CANCELLED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        <TabContent projects={projectByStatus.cancelled} emptyState={emptyState} />
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="ARCHIVED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        <TabContent projects={projectByStatus.archived} emptyState={emptyState} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Projects;