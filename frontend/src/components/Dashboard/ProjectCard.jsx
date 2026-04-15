import { Link } from "react-router-dom";

function ProjectCard({ project }) {
    const statusStyles = {
        planned: 'badge-error',
        ongoing: 'badge-warning',
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });

    return (
        <Link to={`/projects/${project.slug}`} className="block">
            <div className="relative h-full hover:scale-102 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer">
                {/* Background card */}
                <div className="absolute inset-0 bg-base-100 rounded-lg shadow-xl"></div>

                {/* Foreground card */}
                <div className="relative card h-full bg-secondary/25 rounded-lg hover:bg-primary/75 flex flex-row sm:flex-col">

                    {/* Cover image — thumbnail strip on mobile */}
                    <div
                        className="w-32 shrink-0 rounded-l-lg bg-cover bg-center sm:hidden"
                        style={{ backgroundImage: `url(/covers/${project.cover_image ?? 'default'}.jpg)` }}
                    />

                    {/* Cover image — full width on sm+ */}
                    <div
                        className="hidden w-full aspect-video rounded-t-lg bg-cover bg-center sm:block"
                        style={{ backgroundImage: `url(/covers/${project.cover_image ?? 'default'}.jpg)` }}
                    />

                    {/* Content */}
                    <div className="card-body p-2 sm:p-4 min-w-0">
                        <div className="flex justify-between gap-2">
                            <div className="card-title text-base sm:text-lg leading-tight">
                                {project.project_name}
                            </div>
                            <div className={`badge badge-xs sm:badge-sm font-semibold uppercase shrink-0 transition-all duration-200 ${statusStyles[project.status] || 'badge-primary'}`}>
                                {project.status}
                            </div>
                        </div>

                        <p className="text-base-content text-xs sm:text-base leading-tight">{project.project_type}</p>

                        <div className="space-y-1 mt-auto">
                            <progress className="progress progress-info w-full" value="70" max="100" />
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <div className="flex items-center gap-1 text-base-content">
                                    <i className="fas fa-pen-to-square" />
                                    <span>{formatDate(project.updated_at)}</span>
                                </div>
                                {project.deadline && (
                                    <span className="badge badge-sm sm:badge-md badge-error badge-soft gap-1 font-semibold">
                                        <i className="fas fa-calendar-day text-xs" />
                                        {formatDate(project.deadline)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProjectCard;