
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "./Button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/#about" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const getNavClass = (isActive, path, mobile = false) => {
    const active = isActive && (path !== "/#about" || location.hash === "#about");
    return mobile
      ? `mobile-nav-link${active ? " active" : ""}`
      : `site-nav-link${active ? " active" : ""}`;
  };

  return (
    <header className="site-header" id="top">
      <nav className="site-nav">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="site-brand"
        >
          <span className="site-brand-mark" aria-hidden="true">IG</span>
          <span className="site-brand-name">Incredible <b>Graphics</b></span>
        </Link>

        <div className="site-nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) => getNavClass(isActive, link.path)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <Button to="/contact" className="site-nav-cta" variant="primary">
          Start a Project
        </Button>

        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="site-menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-navigation" id="mobile-navigation">
          <div className="mobile-navigation-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => getNavClass(isActive, link.path, true)}
              >
                {link.name}
              </NavLink>
            ))}

            <Button
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-cta"
              variant="primary"
            >
              Start a Project
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
