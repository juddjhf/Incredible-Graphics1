
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  Star,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

import api from "../services/api";
import FileUpload from "../components/FileUpload";

const initialForm = {
  title: "",
  description: "",
  category: "",
  image: {
    url: "",
    publicId: "",
  },
  projectUrl: "",
  tags: "",
  featured: false,
  status: "published",
};

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects");
      const data = response.data;

      setProjects(
        Array.isArray(data)
          ? data
          : data.projects || data.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Projects load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Update form fields
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open form for a new project
  const handleAdd = () => {
    setEditingId(null);
    setFormData({ ...initialForm, image: { ...initialForm.image } });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // Open form for editing
  const handleEdit = (project) => {
    setEditingId(project._id);

    setFormData({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "",
      image: {
        url: project.image?.url || "",
        publicId: project.image?.publicId || "",
      },
      projectUrl: project.projectUrl || "",
      tags: Array.isArray(project.tags)
        ? project.tags.join(", ")
        : "",
      featured: Boolean(project.featured),
      status: project.status || "published",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // Close form
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...initialForm, image: { ...initialForm.image } });
    setError("");
  };

  // Save project
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.image.url) {
        setError("Pehle project ki image select karke upload karo.");
        return;
      }

      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setSuccess("Project successfully update ho gaya.");
      } else {
        await api.post("/projects", payload);
        setSuccess("Project successfully add ho gaya.");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        ...initialForm,
        image: { ...initialForm.image },
      });

      await fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Project save nahi ho paaya. Backend routes check karo."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete project
  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Kya tum is project ko delete karna chahte ho?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/projects/${projectId}`);

      setProjects((previous) =>
        previous.filter((project) => project._id !== projectId)
      );

      setSuccess("Project delete ho gaya.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Project delete nahi ho paaya."
      );
    }
  };

  return (
    <div className="admin-shell min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              to="/admin/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold">
              Manage Projects
            </h1>

            <p className="mt-2 text-gray-400">
              Portfolio projects add, edit aur delete karo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
            {success}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Project Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="Brand Identity Design"
                  className="w-full rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Category *
                </label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Branding, Social Media, Logo..."
                  className="w-full rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe this graphic design project..."
                  className="w-full rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <FileUpload
                  accept="image/*"
                  label="Project Image *"
                  preview={formData.image.url}
                  onUploaded={({ url, publicId }) => {
                    setFormData((previous) => ({
                      ...previous,
                      image: { url, publicId },
                    }));
                    setError("");
                  }}
                />

                {formData.image.url && (
                  <p className="mt-2 text-sm text-green-400">
                    Image uploaded successfully.
                  </p>
                )}
              </div>

              {/* Project URL */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Project / Live Website URL
                </label>
                <input
                  type="url"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Tags (comma separated)
                </label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Logo, Branding, Photoshop"
                  className="w-full rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 outline-none focus:border-violet-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Featured */}
              <label className="flex cursor-pointer items-center gap-3 self-center rounded-xl border border-white/10 p-4">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 accent-violet-500"
                />
                <span className="text-sm text-gray-300">
                  Feature this project on the homepage
                </span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <LoaderCircle size={18} className="animate-spin" />}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Project"
                    : "Save Project"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-white/10 px-6 py-3 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-400">
            <LoaderCircle size={22} className="animate-spin" />
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-5 py-16 text-center">
            <FolderOpen
              size={42}
              className="mx-auto mb-4 text-gray-500"
            />
            <h3 className="text-xl font-semibold">
              No projects found
            </h3>
            <p className="mt-2 text-gray-400">
              Add your first graphic design project.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-[4/3] bg-[#15151c]">
                  {project.image?.url ? (
                    <img
                      src={project.image.url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No image
                    </div>
                  )}

                  {project.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-3 py-1 text-xs text-yellow-300">
                      <Star size={13} />
                      Featured
                    </span>
                  )}

                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-gray-200">
                    {project.status || "published"}
                  </span>
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-violet-400">
                    {project.category || "Uncategorized"}
                  </p>

                  <h3 className="text-lg font-bold">
                    {project.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
                    {project.description}
                  </p>

                  {Array.isArray(project.tags) &&
                    project.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                  <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project._id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProjects;
