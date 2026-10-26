
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  RefreshCw,
  LoaderCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/contact");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.messages)
          ? data.messages
          : Array.isArray(data.data)
            ? data.data
            : [];

      setMessages(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Messages load nahi hue. Backend aur API route check karo."
      );
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

      setMessages((previous) =>
        previous.map((message) =>
          message._id === id ? { ...message, status } : message
        )
      );

      setSelectedMessage((previous) =>
        previous?._id === id ? { ...previous, status } : previous
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Message status update nahi hua."
      );
    }
  };

  const deleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is message ko delete karna chahte ho?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/contact/${id}`);

      setMessages((previous) =>
        previous.filter((message) => message._id !== id)
      );

      setSelectedMessage(null);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Message delete nahi hua."
      );
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true;
    return (message.status || "unread") === filter;
  });

  const unreadCount = messages.filter(
    (message) => (message.status || "unread") === "unread"
  ).length;

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="admin-shell min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              to="/admin/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-violet-300"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <MessageSquare className="text-violet-400" size={30} />
              Messages
            </h1>

            <p className="mt-2 text-gray-400">
              Contact form se aaye hue messages manage karo.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-400">Total Messages</p>
            <p className="mt-2 text-3xl font-bold">{messages.length}</p>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <p className="text-sm text-gray-400">Unread Messages</p>
            <p className="mt-2 text-3xl font-bold text-yellow-300">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <p className="text-sm text-gray-400">Read Messages</p>
            <p className="mt-2 text-3xl font-bold text-green-300">
              {messages.length - unreadCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { value: "all", label: "All Messages" },
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
            { value: "replied", label: "Replied" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                filter === item.value
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
          >
            {error}
          </div>
        )}

        {/* Messages */}
        {loading ? (
          <div className="flex min-h-60 items-center justify-center gap-3 text-gray-400">
            <LoaderCircle size={24} className="animate-spin" />
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <Mail size={42} className="mx-auto text-gray-500" />

            <h2 className="mt-5 text-xl font-semibold">
              No messages found
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Contact form submit hone ke baad messages yahan dikhenge.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredMessages.map((message) => (
              <article
                key={message._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                      <User size={22} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">
                        {message.name || "Unknown"}
                      </h2>

                      <p className="mt-1 break-all text-sm text-gray-400">
                        {message.email || "No email provided"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                      (message.status || "unread") === "unread"
                        ? "bg-yellow-500/10 text-yellow-300"
                        : message.status === "replied"
                          ? "bg-green-500/10 text-green-300"
                          : "bg-blue-500/10 text-blue-300"
                    }`}
                  >
                    {message.status || "unread"}
                  </span>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs text-gray-500">Subject</p>

                  <p className="mt-1 font-medium">
                    {message.subject || "No subject"}
                  </p>

                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
                    {message.message || message.content || "No message content"}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <Clock size={14} />
                  {formatDate(message.createdAt || message.created_at)}

                  {message.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone size={13} />
                      {message.phone}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMessage(message);

                      if ((message.status || "unread") === "unread") {
                        updateStatus(message._id, "read");
                      }
                    }}
                    className="rounded-lg bg-violet-600 px-3 py-2 text-sm transition hover:bg-violet-500"
                  >
                    View / Mark Read
                  </button>

                  <a
                    href={`mailto:${encodeURIComponent(message.email || "")}?subject=${encodeURIComponent("Re: " + (message.subject || "Your enquiry"))}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:bg-white/10"
                  >
                    <Mail size={15} />
                    Reply by Email
                  </a>

                  <button
                    type="button"
                    onClick={() => deleteMessage(message._id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Message details"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#14141b] p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Message Details</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {selectedMessage.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message details"
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 break-all">{selectedMessage.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="mt-1">
                  {selectedMessage.subject || "No subject"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-gray-300">
                  {selectedMessage.message ||
                    selectedMessage.content ||
                    "No message content"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {selectedMessage.status !== "replied" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedMessage._id, "replied")
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium hover:bg-green-500"
                >
                  <CheckCircle2 size={17} />
                  Mark as Replied
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdminMessages;
