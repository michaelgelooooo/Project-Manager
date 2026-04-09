import { useEffect, useState } from "react";
import { projectsAPI } from "../services/api";
import ProjectCard from "../components/Projects/ProjectCards";

function Projects() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

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

    const filtered = data.filter(p =>
        p.project_name.toLowerCase().includes(search.toLowerCase())
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

    const projectGrid = (projects) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:px-2">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );

    const tabContent = (projects) => (
        projects.length === 0 ? emptyState : projectGrid(projects)
    );

    return (
        <div>
            <div className="bg-secondary/50 p-4 rounded-xl shadow-lg">
                <label className="input w-full mb-4">
                    <i className="fas fa-search text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </label>
                <div className="tabs tabs-lift tabs-xl">
                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="PLANNED" defaultChecked />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        {tabContent(projectByStatus.planned)}
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="ONGOING" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        {tabContent(projectByStatus.ongoing)}
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="COMPLETED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        {tabContent(projectByStatus.completed)}
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="PAUSED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        {tabContent(projectByStatus.paused)}
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="CANCELLED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        {tabContent(projectByStatus.cancelled)}
                    </div>

                    <input type="radio" name="project_tabs" className="tab w-40 font-bold rounded-t-xl bg-base-100/50 checked:bg-base-100 me-1" aria-label="ARCHIVED" />
                    <div className="tab-content bg-base-100 rounded-tl-none rounded-b-xl p-8">
                        {tabContent(projectByStatus.archived)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Projects;