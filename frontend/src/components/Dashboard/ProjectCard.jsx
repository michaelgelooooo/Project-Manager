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
                <div className="absolute inset-0 bg-base-100 rounded-xl shadow-xl"></div>

                {/* Foreground card */}
                <div className="relative card h-full bg-secondary/25 rounded-xl hover:bg-primary/75">
                    <div
                        className="w-full aspect-video rounded-t-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(/covers/${project.cover_image ?? 'default'}.jpg)` }}
                    />
                    <div className="card-body p-4">
                        <div className="flex justify-between gap-2">
                            <div className="card-title leading-tight">
                                {project.project_name}
                            </div>
                            <div className={`badge badge-sm font-semibold uppercase p-2 transition-all duration-200 ${statusStyles[project.status] || 'badge-primary'}`}>
                                <i className="text-xs fas fa-circle" />
                                {project.status}
                            </div>
                        </div>

                        <p className="text-base-content leading-tight">{project.project_type}</p>
                        <div className="space-y-1 mt-auto">
                            <progress className="progress progress-info w-full" value="70" max="100" />
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-base-content">
                                    <i className="fas fa-pen-to-square text-[10px]" />
                                    <span>{formatDate(project.updated_at)}</span>
                                </div>
                                {project.deadline && (
                                    <span className="badge badge-error badge-soft gap-1 font-semibold">
                                        <i className="fas fa-calendar-day text-[10px]" />
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