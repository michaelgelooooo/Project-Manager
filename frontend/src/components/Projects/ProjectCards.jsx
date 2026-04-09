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
    }

    return (
        <div className={`card flex-row bg-secondary/25 rounded-xl shadow-xl hover:bg-primary/75 hover:scale-102 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer border-l-[6px] ${coverBorder[project.cover_image ?? 'default']}`}>
            <div className="card-body p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="card-title text-base leading-tight">
                        {project.project_name}
                    </div>
                    <span className="badge badge-info badge-soft text-xs font-semibold shrink-0">{project.project_type}</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                        <progress className="progress progress-info w-full" value="70" max="100" />
                    </div>
                    <div className="col-span-1 text-right">
                        {project.deadline && (
                            <span className="text-xs font-semibold text-base-content">
                                {new Date(project.deadline).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit',
                                })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProjectCard;