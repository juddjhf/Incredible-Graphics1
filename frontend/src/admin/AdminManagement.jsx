
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Video,
  MessageSquare,
  ShoppingBag,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";
import FileUpload from "../components/FileUpload";

const emptyService = {
  title: "",
  description: "",
  category: "Graphic Design",
  price: "",
  deliveryDays: "",
  features: "",
  image: { url: "", publicId: "" },
  isActive: true,
  featured: false,
};

const emptyReel = {
  title: "",
  description: "",
  videoUrl: "",
  videoPublicId: "",
  thumbnail: { url: "", publicId: "" },
  platform: "Instagram",
  category: "Graphic Design",
  featured: false,
  isActive: true,
  displayOrder: 0,
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#15151c] px-4 py-3 text-white outline-none focus:border-violet-500";

const labelClass = "mb-2 block text-sm text-gray-300";

function getList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function Notice({ error, success }) {
  return (
    <>
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
    </>
  );
}

function PageHeader({ title, description, onAdd, addLabel }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-gray-400">{description}</p>
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
        >
          <Plus size={18} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyService);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/services");
      setServices(getList(response.data, "services"));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Services load nahi hui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const change = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addService = () => {
    setForm({ ...emptyService, image: { ...emptyService.image } });
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const editService = (service) => {
    setEditingId(service._id);
    setForm({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "Graphic Design",
      price: service.price ?? "",
      deliveryDays: service.deliveryDays ?? "",
      features: Array.isArray(service.features)
        ? service.features.join(", ")
        : "",
      image: {
        url: service.image?.url || "",
        publicId: service.image?.publicId || "",
      },
      isActive: service.isActive !== false,
      featured: Boolean(service.featured),
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const saveService = async (e) => {
    e.preventDefault();
    if (saving) return;

    setError("");
    setSuccess("");

    if (!form.image.url) {
      setError("Pehle service ki image upload karo.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        price: form.price === "" ? 0 : Number(form.price),
        deliveryDays:
          form.deliveryDays === "" ? 0 : Number(form.deliveryDays),
        features: form.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        setSuccess("Service update ho gayi.");
      } else {
        await api.post("/services", payload);
        setSuccess("Service add ho gayi.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyService, image: { ...emptyService.image } });
      await fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || "Service save nahi hui.");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Kya tum ye service delete karna chahte ho?")) return;

    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Service delete ho gayi.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Service delete nahi hui.");
    }
  };

  return (
    <main className="admin-shell min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Manage Services"
          description="Services add, edit aur delete karo."
          onAdd={addService}
          addLabel="Add Service"
        />
        <Notice error={error} success={success} />

        {showForm && (
          <form onSubmit={saveService} className="mb-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Service" : "New Service"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
                <X />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Service title *</label>
                <input name="title" value={form.title} onChange={change} required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <input name="category" value={form.category} onChange={change} required className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description *</label>
                <textarea name="description" value={form.description} onChange={change} required rows={3} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <FileUpload
                  accept="image/*"
                  label="Service Image *"
                  preview={form.image.url}
                  onUploaded={({ url, publicId }) =>
                    setForm((prev) => ({
                      ...prev,
                      image: { url, publicId },
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Price</label>
                <input type="number" min="0" name="price" value={form.price} onChange={change} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Delivery days</label>
                <input type="number" min="0" name="deliveryDays" value={form.deliveryDays} onChange={change} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Features (comma separated)</label>
                <input name="features" value={form.features} onChange={change} placeholder="Logo design, Source files, Revisions" className={inputClass} />
              </div>

              <label className="flex items-center gap-3">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={change} />
                Active service
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" name="featured" checked={form.featured} onChange={change} />
                Featured service
              </label>
            </div>

            <button type="submit" disabled={saving} aria-busy={saving} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold disabled:opacity-60">
              {saving && <LoaderCircle size={18} className="animate-spin" />}
              {saving ? "Saving..." : editingId ? "Update Service" : "Save Service"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="py-10 text-gray-400">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="py-10 text-gray-400">Abhi koi service nahi hai.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service._id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                {service.image?.url ? (
                  <img src={service.image.url} alt={service.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-white/5"><ImageIcon /></div>
                )}
                <div className="space-y-3 p-5">
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="text-sm text-gray-400">{service.description}</p>
                  <p className="text-sm text-violet-300">
                    {service.price != null ? `Price: ${service.price}` : "Price not set"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {service.isActive === false ? "Inactive" : "Active"}
                    {service.featured ? " · Featured" : ""}
                  </p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => editService(service)} className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/10 px-3 py-2"><Pencil className="mr-2" size={15} />Edit</button>
                    <button type="button" onClick={() => deleteService(service._id)} className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-500/20 px-3 py-2 text-red-300"><Trash2 className="mr-2" size={15} />Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AdminReels() {
  const [reels, setReels] = useState([]);
  const [form, setForm] = useState(emptyReel);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reels");
      setReels(getList(response.data, "reels"));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Reels load nahi hui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const change = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addReel = () => {
    setForm({ ...emptyReel, thumbnail: { ...emptyReel.thumbnail } });
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const editReel = (reel) => {
    setEditingId(reel._id);
    setForm({
      title: reel.title || "",
      description: reel.description || "",
      videoUrl: reel.videoUrl || "",
      videoPublicId: reel.videoPublicId || "",
      thumbnail: {
        url: reel.thumbnail?.url || "",
        publicId: reel.thumbnail?.publicId || "",
      },
      platform: reel.platform || "Instagram",
      category: reel.category || "Graphic Design",
      featured: Boolean(reel.featured),
      isActive: reel.isActive !== false,
      displayOrder: reel.displayOrder ?? 0,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const saveReel = async (e) => {
    e.preventDefault();
    if (saving) return;

    setError("");
    setSuccess("");

    if (!form.videoUrl) {
      setError("Pehle reel video select karke upload karo.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder) || 0,
      };

      if (editingId) {
        await api.put(`/reels/${editingId}`, payload);
        setSuccess("Reel update ho gayi.");
      } else {
        await api.post("/reels", payload);
        setSuccess("Reel add ho gayi.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyReel, thumbnail: { ...emptyReel.thumbnail } });
      await fetchReels();
    } catch (err) {
      setError(err.response?.data?.message || "Reel save nahi hui.");
    } finally {
      setSaving(false);
    }
  };

  const deleteReel = async (id) => {
    if (!window.confirm("Kya tum ye reel delete karna chahte ho?")) return;

    try {
      await api.delete(`/reels/${id}`);
      setReels((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Reel delete ho gayi.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Reel delete nahi hui.");
    }
  };

  return (
    <main className="admin-shell min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Manage Reels"
          description="Video reels aur thumbnails manage karo."
          onAdd={addReel}
          addLabel="Add Reel"
        />
        <Notice error={error} success={success} />

        {showForm && (
          <form onSubmit={saveReel} className="mb-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Reel" : "New Reel"}</h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form"><X /></button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Reel title *</label>
                <input name="title" value={form.title} onChange={change} required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Platform</label>
                <select name="platform" value={form.platform} onChange={change} className={inputClass}>
                  <option>Instagram</option>
                  <option>YouTube</option>
                  <option>Facebook</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea name="description" value={form.description} onChange={change} rows={3} className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <FileUpload
                  accept="video/*"
                  label="Reel Video *"
                  preview={form.videoUrl}
                  onUploaded={({ url, publicId }) =>
                    setForm((prev) => ({
                      ...prev,
                      videoUrl: url,
                      videoPublicId: publicId,
                    }))
                  }
                />
                {form.videoUrl && (
                  <p className="mt-2 break-all text-xs text-green-400">
                    Video uploaded successfully.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <FileUpload
                  accept="image/*"
                  label="Reel Thumbnail (optional)"
                  preview={form.thumbnail.url}
                  onUploaded={({ url, publicId }) =>
                    setForm((prev) => ({
                      ...prev,
                      thumbnail: { url, publicId },
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <input name="category" value={form.category} onChange={change} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Display order</label>
                <input type="number" name="displayOrder" value={form.displayOrder} onChange={change} className={inputClass} />
              </div>

              <label className="flex items-center gap-3">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={change} />
                Active reel
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" name="featured" checked={form.featured} onChange={change} />
                Featured reel
              </label>
            </div>

            <button type="submit" disabled={saving} aria-busy={saving} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold disabled:opacity-60">
              {saving && <LoaderCircle size={18} className="animate-spin" />}
              {saving ? "Saving..." : editingId ? "Update Reel" : "Save Reel"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="py-10 text-gray-400">Loading reels...</p>
        ) : reels.length === 0 ? (
          <p className="py-10 text-gray-400">Abhi koi reel nahi hai.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reels.map((reel) => (
              <article key={reel._id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                {reel.thumbnail?.url ? (
                  <img src={reel.thumbnail.url} alt={reel.title} className="h-48 w-full object-cover" />
                ) : reel.videoUrl ? (
                  <video src={reel.videoUrl} controls preload="metadata" className="h-48 w-full bg-black object-contain" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-white/5"><Video /></div>
                )}
                <div className="space-y-3 p-5">
                  <h3 className="text-lg font-bold">{reel.title}</h3>
                  <p className="text-sm text-gray-400">{reel.platform} · {reel.category}</p>
                  <p className="text-xs text-gray-500">{reel.isActive === false ? "Inactive" : "Active"}</p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => editReel(reel)} className="flex-1 rounded-lg border border-white/10 px-3 py-2"><Pencil className="mr-2 inline" size={15} />Edit</button>
                    <button type="button" onClick={() => deleteReel(reel._id)} className="flex-1 rounded-lg border border-red-500/20 px-3 py-2 text-red-300"><Trash2 className="mr-2 inline" size={15} />Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact");
      setMessages(getList(response.data, "messages"));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Messages load nahi hue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/contact/${id}`, { status });
      setMessages((prev) =>
        prev.map((item) => item._id === id ? { ...item, status } : item)
      );
      setSuccess("Message status update ho gaya.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Message status update nahi hua.");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Kya tum ye message delete karna chahte ho?")) return;

    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Message delete ho gaya.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Message delete nahi hua.");
    }
  };

  return (
    <main className="admin-shell min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader title="Contact Messages" description="Clients ke messages aur unka status manage karo." />
        <Notice error={error} success={success} />

        <div className="mb-5 flex justify-end">
          <button type="button" onClick={fetchMessages} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm"><RefreshCw size={15} />Refresh</button>
        </div>

        {loading ? (
          <p className="py-10 text-gray-400">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-gray-400"><MessageSquare className="mx-auto mb-3" size={32} />No messages found.</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <article key={message._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold">{message.subject || "Contact message"}</h3>
                    <p className="mt-1 text-sm text-violet-300">{message.name} · {message.email}</p>
                    {message.phone && <p className="mt-1 text-sm text-gray-400">{message.phone}</p>}
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-300">{message.message}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={message.status || "new"}
                      onChange={(e) => updateStatus(message._id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-[#15151c] px-3 py-2 text-sm"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button type="button" onClick={() => deleteMessage(message._id)} className="rounded-lg border border-red-500/20 p-2 text-red-300" aria-label="Delete message"><Trash2 size={17} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(getList(response.data, "orders"));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Orders load nahi hue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((item) => item._id === id ? { ...item, status } : item)
      );
      setSuccess("Order status update ho gaya.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Order status update nahi hua.");
    }
  };

  const updatePayment = async (id, paymentStatus) => {
    try {
      await api.patch(`/orders/${id}/payment`, { paymentStatus });
      setOrders((prev) =>
        prev.map((item) => item._id === id ? { ...item, paymentStatus } : item)
      );
      setSuccess("Payment status update ho gaya.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Payment status update nahi hua.");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Kya tum ye order delete karna chahte ho?")) return;

    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((item) => item._id !== id));
      setSuccess("Order delete ho gaya.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Order delete nahi hua.");
    }
  };

  return (
    <main className="admin-shell min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader title="Client Orders" description="Client project requests aur payment status manage karo." />
        <Notice error={error} success={success} />

        <div className="mb-5 flex justify-end">
          <button type="button" onClick={fetchOrders} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm"><RefreshCw size={15} />Refresh</button>
        </div>

        {loading ? (
          <p className="py-10 text-gray-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400"><ShoppingBag className="mx-auto mb-3" size={32} />No orders found.</div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold">{order.projectTitle || order.service?.title || "Project Request"}</h3>
                    <p className="mt-1 text-sm text-violet-300">{order.clientName} · {order.clientEmail}</p>
                    {order.clientPhone && <p className="mt-1 text-sm text-gray-400">{order.clientPhone}</p>}
                    {order.budget && <p className="mt-2 text-sm text-gray-300">Budget: {order.budget}</p>}
                    {order.deadline && <p className="mt-1 text-sm text-gray-400">Deadline: {new Date(order.deadline).toLocaleDateString()}</p>}
                    {order.projectDescription && <p className="mt-3 whitespace-pre-wrap text-sm text-gray-300">{order.projectDescription}</p>}
                    {Array.isArray(order.referenceLinks) && order.referenceLinks.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {order.referenceLinks.map((link, index) => (
                          <a key={`${link}-${index}`} href={link} target="_blank" rel="noreferrer" className="block break-all text-sm text-violet-300 underline">{link}</a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:w-56">
                    <label className="text-xs text-gray-400">
                      Order status
                      <select value={order.status || "pending"} onChange={(e) => updateStatus(order._id, e.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#15151c] px-3 py-2 text-sm text-white">
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="in-progress">In progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>

                    <label className="text-xs text-gray-400">
                      Payment status
                      <select value={order.paymentStatus || "unpaid"} onChange={(e) => updatePayment(order._id, e.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#15151c] px-3 py-2 text-sm text-white">
                        <option value="unpaid">Unpaid</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </label>

                    <button type="button" onClick={() => deleteOrder(order._id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300"><Trash2 size={15} />Delete Order</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export { AdminServices, AdminReels, AdminMessages, AdminOrders };
