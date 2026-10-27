
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Services from "./pages/Services";
import Order from "./pages/Order";
import Reels from "./pages/Reels";
import Contact from "./pages/Contact";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProjects from "./admin/AdminProjects";
import AdminMessages from "./admin/AdminMessages";

import {
  AdminServices,
  AdminReels,
  AdminOrders,
} from "./admin/AdminManagement";

import AdminRoute from "./admin/AdminRoute";

// Public website layout
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// Admin pages layout
function AdminLayout() {
  return <Outlet />;
}

// Main application
function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/order" element={<Order />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin login */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Protected admin pages */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/projects"
            element={<AdminProjects />}
          />

          <Route
            path="/admin/services"
            element={<AdminServices />}
          />

          <Route
            path="/admin/reels"
            element={<AdminReels />}
          />

          <Route
            path="/admin/messages"
            element={<AdminMessages />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
