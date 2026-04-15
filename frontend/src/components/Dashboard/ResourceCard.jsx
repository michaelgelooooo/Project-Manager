function ResourceCard({ resource }) {
    return (
        <div className="relative hover:scale-102 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer">
            {/* Background card */}
            <div className="absolute inset-0 bg-base-100 rounded-lg shadow-xl"></div>

            {/* Foreground card */}
            <div className="relative card bg-secondary/25 rounded-lg hover:bg-primary/75">
                <div className="card-body p-4">
                    <div className="flex justify-between">
                        <h3 className="card-title text-lg">{resource.resource_title}</h3>
                        <div className="badge badge-sm badge-soft uppercase font-semibold badge-info">
                            {resource.resource_type}
                        </div>
                    </div>
                    <p className="text-sm text-base-content">{resource.project_name}</p>
                    <p className="text-sm">
                        <span className="font-semibold">Last Updated:</span>{' '}
                        {new Date(resource.updated_at).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            weekday: 'short',
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
export default ResourceCard;