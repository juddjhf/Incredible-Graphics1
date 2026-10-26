
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LoaderCircle } from "lucide-react";
import api from "../services/api";

function AdminLogout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Agar backend logout endpoint available hai, use call karo.
      await api.post("/admin/logout");
    } catch (error) {
      // Local token phir bhi clear karna hai.
      console.error(
        "Logout API request failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      localStorage.removeItem("adminToken");
      setLoading(false);
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
    >
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        <LogOut size={18} />
      )}
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

export default AdminLogout;
