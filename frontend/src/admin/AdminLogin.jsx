
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LockKeyhole, Mail, LoaderCircle } from "lucide-react";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", formData);
      const data = response.data;

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      if (!token) {
        throw new Error(
          "Login response mein token nahi mila. Backend response check karo."
        );
      }

      localStorage.setItem("adminToken", token);

      navigate(
        location.state?.from?.pathname || "/admin/dashboard",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl sm:p-9">
        <div className="mb-8 text-center">
          <img
            src="/incredible-logo.png"
            alt="Incredible Graphics logo"
            className="mx-auto h-16 w-16 border border-white/10 object-cover"
          />

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-red-200">
            Incredible Graphics
          </p>

          <h1 className="mt-5 text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-gray-300"
            >
              Admin Email
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111116] px-4 focus-within:border-violet-500">
              <Mail size={18} className="text-gray-500" />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent py-3 text-white outline-none placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-gray-300"
            >
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111116] px-4 focus-within:border-violet-500">
              <LockKeyhole size={18} className="text-gray-500" />

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent py-3 text-white outline-none placeholder:text-gray-600"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-gray-400 transition hover:text-violet-300"
        >
          ← Back to website
        </Link>
      </section>
    </main>
  );
}

export default AdminLogin;
