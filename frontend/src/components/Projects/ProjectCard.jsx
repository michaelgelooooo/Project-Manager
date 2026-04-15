import { Link } from "react-router-dom";

function ProjectCard({ project }) {
    const coverBorder = {
        default: 'border-l-gray-400',
        white: 'border-l-gray-200',
        gray: 'border-l-gray-500',
        black: 'border-l-gray-900',
        red: 'border-l-red-500',
        orange: 'border-l-orange-500',
        yellow: 'border-l-yellow-400',
        green: 'border-l-green-500',
        blue: 'border-l-blue-500',
        purple: 'border-l-purple-500',
        pink: 'border-l-pink-400',
        brown: 'border-l-amber-800',
        cyan: 'border-l-cyan-400',
    };
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    return (
        <Link to={`/projects/${project.slug}`} className="block">
            <div className={`relative h-full hover:scale-101 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer`}>
                {/* Background card */}
                <div className={`absolute inset-0 bg-base-100 rounded-lg shadow-xl border-l-[8px] ${coverBorder[project.cover_image ?? 'default']}`}></div>

                {/* Foreground card */}
                <div className={`relative card h-full flex-row bg-secondary/25 rounded-lg hover:bg-primary/75 border-l-[8px] ${coverBorder[project.cover_image ?? 'default']}`}>
                    <div className="card-body p-4 flex flex-col gap-2">
                        {/* Row 1: Name + Type badge */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="card-title text-lg leading-tight">{project.project_name}</div>
                            <span className="badge badge-info badge-soft text-sm font-semibold shrink-0">{project.project_type}</span>
                        </div>
                        {/* Row 2: Progress bar */}
                        <progress className="progress progress-info w-full mt-auto" value="70" max="100" />
                        {/* Row 3: Updated date + Deadline */}
                        <div className="flex items-center justify-between text-sm text-base-content">
                            <div className="flex items-center gap-1">
                                <i className="fas fa-pen-to-square text-[10px]" />
                                <span>{formatDate(project.updated_at)}</span>
                            </div>
                            {project.deadline ? (
                                <span className="badge badge-error badge-soft gap-1 font-semibold">
                                    <i className="fas fa-calendar-day text-[10px]" />
                                    {formatDate(project.deadline)}
                                </span>
                            ) : (
                                <span className="badge badge-neutral gap-1 font-semibold">
                                    <i className="fas fa-calendar-xmark text-[10px]" />
                                    No Deadline
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
export default ProjectCard;