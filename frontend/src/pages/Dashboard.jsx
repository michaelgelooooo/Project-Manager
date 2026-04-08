import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import ProjectCard from '../components/Dashboard/ProjectCard';
import TaskCard from '../components/Dashboard/TaskCard';
import ResourceCard from '../components/Dashboard/ResourceCard'

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openPanel, setOpenPanel] = useState('todo');

    const toggle = (panel) => {
        setOpenPanel(current => current === panel ? (panel === 'todo' ? 'resources' : 'todo') : panel);
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardAPI.getData();
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

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

    return (
        <div className='grid grid-cols-1 sm:grid-cols-12 sm:gap-4'>
            <section className='sm:col-span-8'>
                {/* Mobile: collapse */}
                <div className="collapse collapse-arrow rounded-xl sm:hidden overflow-visible">
                    <input type="checkbox" defaultChecked />
                    <div className="collapse-title text-2xl font-bold bg-secondary/75 rounded-xl text-base-100 p-4">
                        RECENT PROJECTS
                    </div>
                    <div className="collapse-content p-0 mt-4">
                        {data?.urgent_projects?.length === 0 ? (
                            <div className="group flex flex-col items-center justify-center h-64 bg-secondary/25 hover:bg-primary/75 border-3 border-dashed border-secondary rounded-xl transition-color duration-150 ease-in-out p-4 mb-4">
                                <i className="fas fa-folder-open text-6xl mb-4 transition-transform duration-200 group-hover:scale-110"></i>
                                <p className="text-xl font-semibold">No urgent projects</p>
                                <p className="text-base text-center">Projects with upcoming deadlines will appear here</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {data?.urgent_projects?.map((project) => (
                                    <div key={project.id} className="last:mb-4">
                                        <ProjectCard project={project} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop: plain section */}
                <div className="hidden sm:block">
                    <h1 className="text-4xl text-base-100 bg-secondary/75 rounded-xl font-bold p-4 mb-4">
                        RECENT PROJECTS
                    </h1>
                    {data?.urgent_projects?.length === 0 ? (
                        <div className="group flex flex-col items-center justify-center h-128 bg-secondary/25 hover:bg-primary/75 border-3 border-dashed border-secondary rounded-xl transition-color duration-150 ease-in-out p-4">
                            <i className="fas fa-folder-open text-6xl mb-4 transition-transform duration-200 group-hover:scale-110"></i>
                            <p className="text-xl font-semibold">No urgent projects</p>
                            <p className="text-base text-center">Projects with upcoming deadlines will appear here</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:px-2">
                            {data?.urgent_projects?.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="sm:col-span-4 space-y-4">
                <details
                    className="collapse collapse-arrow bg-secondary/75 rounded-xl"
                    open={openPanel === 'todo'}
                >
                    <summary
                        className="collapse-title text-2xl sm:text-4xl text-base-100 font-bold"
                        onClick={(e) => { e.preventDefault(); toggle('todo'); }}
                    >
                        TO-DO LIST
                    </summary>
                    <div className="collapse-content space-y-2">
                        {data?.urgent_tasks?.length === 0 ? (
                            <div className="group flex flex-col items-center justify-center h-128 hover:bg-primary/50 border-3 border-dashed border-base-100 rounded-xl transition-all duration-150 ease-in-out p-4">
                                <i className="fas fa-clipboard-list text-6xl mb-2 transition-transform duration-200 group-hover:scale-110"></i>
                                <p className="text-xl font-semibold">No urgent tasks</p>
                                <p className="text-base text-center">Tasks with upcoming deadlines will appear here</p>
                            </div>
                        ) : (
                            data?.urgent_tasks?.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        )}
                    </div>
                </details>

                <details
                    className="collapse collapse-arrow bg-secondary/75 rounded-xl"
                    open={openPanel === 'resources'}
                >
                    <summary
                        className="collapse-title text-2xl sm:text-4xl text-base-100 font-bold"
                        onClick={(e) => { e.preventDefault(); toggle('resources'); }}
                    >
                        RESOURCE BOARD
                    </summary>
                    <div className="collapse-content text-sm">
                        {data?.recent_resources?.length === 0 ? (
                            <div className="group flex flex-col items-center justify-center h-128 hover:bg-primary/50 border-3 border-dashed border-base-100 rounded-xl transition-color duration-150 ease-in-out p-4">
                                <i className="fas fa-book-open text-6xl mb-2 transition-transform duration-200 group-hover:scale-110"></i>
                                <p className="text-xl font-semibold">No recent resources</p>
                                <p className="text-base text-center">Recently updated resources will appear here</p>
                            </div>
                        ) : (
                            data?.recent_resources?.map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))
                        )}
                    </div>
                </details>
            </section>
        </div>
    );
}

export default Dashboard;