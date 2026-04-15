import { useState, useEffect } from "react";
import { projectsAPI } from "../../services/api";

const COVER_OPTIONS = [
    "default", "white", "gray", "black",
    "red", "orange", "yellow", "green",
    "blue", "purple", "pink", "brown", "cyan",
];

function ProjectForm({ header, project = null, onSuccess }) {
    const [form, setForm] = useState({
        project_name: "",
        description: "",
        project_type: "",
        status: "planned",
        deadline: "",
        cover_image: "default",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (project) {
            setForm({
                project_name: project.project_name,
                description: project.description ?? "",
                project_type: project.project_type,
                status: project.status,
                deadline: project.deadline ?? "",
                cover_image: project.cover_image ?? "default",
            });
        } else {
            setForm({
                project_name: "",
                description: "",
                project_type: "",
                status: "planned",
                deadline: "",
                cover_image: "default",
            });
        }
    }, [project]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCoverNav = (dir) => {
        const currentIndex = COVER_OPTIONS.indexOf(form.cover_image);
        const newIndex = (currentIndex + dir + COVER_OPTIONS.length) % COVER_OPTIONS.length;
        setForm(prev => ({ ...prev, cover_image: COVER_OPTIONS[newIndex] }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            if (project) {
                await projectsAPI.partialUpdate(project.slug, {
                    ...form,
                    deadline: form.deadline || null,
                });
                document.getElementById("project_form").close();
                onSuccess?.();
            } else {
                const result = await projectsAPI.create({
                    ...form,
                    deadline: form.deadline || null,
                });
                document.getElementById("project_form").close();
                onSuccess?.(result.data.slug);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setError(null);
        if (project) {
            setForm({
                project_name: project.project_name,
                description: project.description ?? "",
                project_type: project.project_type,
                status: project.status,
                deadline: project.deadline ?? "",
                cover_image: project.cover_image ?? "default",
            });
        } else {
            setForm({ project_name: "", description: "", project_type: "", status: "planned", deadline: "", cover_image: "default" });
        }
    };

    return (
        <dialog id="project_form" className="modal modal-top sm:modal-middle">
            <div className="modal-box bg-neutral max-w-xl">
                <h1 className="font-bold text-2xl">{header}</h1>
                <div className="divider my-1"></div>

                <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <label className="label">Project Name</label>
                        <input
                            type="text"
                            name="project_name"
                            value={form.project_name}
                            onChange={handleChange}
                            className="input input-secondary input-lg w-full"
                            placeholder="e.g. Website Redesign"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="label">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="textarea textarea-secondary textarea-lg w-full resize-y"
                            placeholder="What is this project about?"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="label">Project Type</label>
                            <input
                                type="text"
                                name="project_type"
                                value={form.project_type}
                                onChange={handleChange}
                                className="input input-secondary input-lg w-full"
                                placeholder="e.g. Marketing"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="label">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="select select-secondary select-lg w-full"
                            >
                                <option value="planned">Planned</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                                <option value="paused">Paused</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="label">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            className="input input-secondary input-lg w-full"
                        />
                    </div>

                    {/* Cover Image Picker */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="label">Cover Image</label>
                            <span className="text-sm text-base-content/50 capitalize">{form.cover_image}</span>
                        </div>
                        <div className="relative w-full h-28 rounded-lg overflow-hidden">
                            <img
                                src={`/covers/${form.cover_image}.jpg`}
                                alt={form.cover_image}
                                className="w-full h-full object-cover transition-all duration-200"
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                                <button type="button" onClick={() => handleCoverNav(-1)} className="btn btn-circle btn-sm">❮</button>
                                <button type="button" onClick={() => handleCoverNav(1)} className="btn btn-circle btn-sm">❯</button>
                            </div>
                        </div>
                        <div className="flex justify-center gap-1 flex-wrap">
                            {COVER_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, cover_image: opt }))}
                                    className={`w-2 h-2 rounded-full transition-all ${form.cover_image === opt ? "bg-primary scale-125" : "bg-base-content/30"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error mt-4 py-2 text-sm">
                        <i className="fas fa-circle-exclamation text-xs" />
                        {error}
                    </div>
                )}

                <div className="divider"></div>
                <div className="modal-action my-0">
                    <form method="dialog">
                        <button className="btn btn-ghost btn-lg" onClick={handleCancel}>CANCEL</button>
                    </form>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleSubmit}
                        disabled={loading || !form.project_name.trim()}
                    >
                        {loading
                            ? <span className="loading loading-spinner loading-sm" />
                            : <i className="fas fa-floppy-disk" />
                        }
                        SAVE
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}

export default ProjectForm;