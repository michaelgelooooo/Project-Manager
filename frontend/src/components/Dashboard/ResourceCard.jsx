function ResourceCard({ resource }) {
    return (
        <div className="card bg-base-100/75 rounded-xl shadow-xl hover:bg-primary/50 hover:scale-102 hover:-translate-y-1 transform transition-all duration-150 ease-in-out cursor-pointer">
            <div className="card-body p-4">
                <div className="flex justify-between">
                    <h3 className="card-title text-lg">{resource.resource_title}</h3>
                    <div className='badge badge-sm badge-soft uppercase font-semibold badge-info'>
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
                        weekday: 'short'
                    })}
                </p>
            </div>
        </div>
    )
}

export default ResourceCard;