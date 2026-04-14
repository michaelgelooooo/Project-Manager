import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { projectsAPI } from "../services/api";
import ProjectForm from "../components/Projects/ProjectForm";

const STATUS_BADGES = {
    planned: "badge-info",
    ongoing: "badge-success",
    completed: "badge-primary",
    paused: "badge-warning",
    cancelled: "badge-error",
    archived: "badge-ghost",
};

function formatDate(dateStr, includeTime = false) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
    });
}

function formatTime(dateStr) {
    return formatDate(dateStr, true).split('at')[1]?.trim();
}

function MetaCard({ icon, label, dateStr }) {
    return (
        <div className="bg-base-100 rounded-xl p-4 space-y-1">
            <p className="text-xs text-base-content uppercase tracking-wide">
                <i className={`fa-regular ${icon} me-2`} />{label}
            </p>
            <p className="font-semibold text-sm sm:text-base">{formatDate(dateStr)}</p>
            <p className="text-xs text-base-content">{formatTime(dateStr)}</p>
        </div>
    );
}

function ProjectDetails() {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const fetchProjectDetails = async () => {    // lift out of useEffect
        try {
            const response = await projectsAPI.getBySlug(slug);
            setData(response.data);
            document.title = `MOMENTUM | ${response.data.project_name}`;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [slug]);

    const handleDelete = async () => {
        try {
            await projectsAPI.delete(data.slug);
            navigate("/projects/");
        } catch (err) {
            console.error(err.response?.data);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg" />
        </div>
    );

    if (error) return (
        <div className="p-8">
            <div className="alert alert-error"><span>Error: {error}</span></div>
        </div>
    );

    return (
        <>
            <div className='border border-secondary px-4 rounded-lg w-full mb-4'>
                <div className="breadcrumbs w-full text-xs sm:text-sm">
                    <ul>
                        <li className='text-secondary'>
                            <span className='hidden sm:inline'>
                                <i className='fas fa-tv me-2'></i>
                            </span>
                            <Link to="/">Dashboard</Link>
                        </li>
                        <li className='text-secondary'>
                            <span className='hidden sm:inline'>
                                <i className='fas fa-folder-open me-2'></i>
                            </span>
                            <Link to="/projects/">Projects</Link>
                        </li>
                        <li>
                            <span className='hidden sm:inline'>
                                <i className='fas fa-file me-2'></i>
                            </span>
                            {data.project_name}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Hero */}
            <div className="relative h-48 sm:h-96 w-full">
                <img
                    src={`/covers/${data.cover_image ?? 'default'}.jpg`}
                    alt={data.project_name}
                    className="w-full h-full object-cover rounded-xl sm:rounded-4xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-xl sm:rounded-4xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4">

                {/* Main card */}
                <div className="relative -mt-16 sm:-mt-32 z-10">
                    <div className="absolute inset-0 bg-base-100 rounded-2xl shadow-xl" />
                    <div className="relative card bg-secondary/25">
                        <div className="card-body p-4 sm:p-8 gap-4">

                            {/* Header + Description */}
                            <div className="p-2">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                    <div className="space-y-1">
                                        <p className="text-sm uppercase tracking-widest font-medium">
                                            {data.project_type}
                                        </p>
                                        <h1 className="text-xl sm:text-4xl font-bold leading-tight">
                                            {data.project_name}
                                        </h1>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`badge badge-md sm:badge-lg font-semibold ${STATUS_BADGES[data.status] ?? 'badge-ghost'}`}>
                                            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => document.getElementById("project_form").showModal()}
                                        >
                                            <i className="fas fa-pen-to-square text-xs" /> EDIT
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => document.getElementById("delete_modal").showModal()}
                                        >
                                            <i className="fas fa-trash text-xs" /> DELETE
                                        </button>
                                    </div>
                                </div>

                                <div className="divider my-2 before:bg-neutral-content after:bg-neutral-content" />

                                {data.description && (
                                    <div className="text-sm sm:text-base leading-relaxed text-base-content">
                                        {data.description}
                                    </div>
                                )}
                            </div>

                            {/* Deadline */}
                            {data.deadline && (
                                <div className="bg-secondary rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-secondary-content">
                                            Deadline
                                        </p>
                                        <p className="text-lg sm:text-2xl font-bold text-secondary-content">
                                            {formatDate(data.deadline)}
                                        </p>
                                    </div>
                                    <span className="badge badge-secondary badge-soft font-semibold gap-2">
                                        <i className="fa-solid fa-triangle-exclamation text-[10px]" /> Important
                                    </span>
                                </div>
                            )}

                            {/* Meta grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <MetaCard icon="fa-calendar" label="Created" dateStr={data.created_at} />
                                <MetaCard icon="fa-clock" label="Last Updated" dateStr={data.updated_at} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <ProjectForm
                header="Update Project"
                project={data}
                onSuccess={fetchProjectDetails}
            />

            {/* Delete confirmation */}
            <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-neutral">
                    <h3 className="font-bold text-lg">Delete Project?</h3>
                    <p className="text-sm text-base-content/60 mt-1">
                        <span className="font-semibold text-base-content">{data.project_name}</span> will be permanently deleted. This cannot be undone.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost">CANCEL</button>
                        </form>
                        <button className="btn btn-error" onClick={handleDelete}>
                            <i className="fas fa-trash text-xs" /> DELETE
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}

export default ProjectDetails;