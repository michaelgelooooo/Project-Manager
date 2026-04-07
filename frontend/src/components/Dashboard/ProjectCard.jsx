function ProjectCard({ project }) {
    const statusStyles = {
        planned: 'badge-error',
        ongoing: 'badge-warning',
    };

    return (
        <div className="card bg-secondary/25 rounded-xl shadow-xl hover:bg-primary/75 hover:scale-102 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer">

            <div
                className="w-full aspect-video rounded-t-xl bg-cover bg-center"
                style={{ backgroundImage: `url(/covers/${project.cover_image ?? 'default'}.jpg)` }}
            />

            <div className="card-body p-4">

                <div className="flex justify-between gap-2">
                    <div className="card-title leading-tight">
                        {project.project_name}
                    </div>

                    <div
                        className={`badge font-semibold capitalize p-2 transition-all duration-200 ${statusStyles[project.status] || 'badge-primary'
                            }`}
                    >
                        <i className="text-xs fas fa-circle"></i>
                        {project.status}
                    </div>
                </div>

                <div className="space-y-1 mt-1">
                    <p className="text-base-content leading-tight">
                        {project.project_type}
                    </p>

                    {project.deadline && (
                        <div className="text-sm leading-tight">
                            <span className="font-semibold">Deadline:</span>{' '}
                            {new Date(project.deadline).toLocaleDateString()}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ProjectCard;