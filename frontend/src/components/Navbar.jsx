
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "Reels", path: "/reels" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="site-brand"
        >
          <img
            src="/incredible-logo.png"
            alt="Incredible Graphics logo"
            className="site-brand-mark"
          />
          <span className="site-brand-name">Incredible <b>Graphics</b></span>
        </Link>

        <div className="site-nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `site-nav-link${isActive ? " active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <Link
          to="/order"
          className="site-nav-cta"
        >
          Start a Project
          <ArrowUpRight size={16} />
        </Link>

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
                className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/order"
              onClick={() => setMenuOpen(false)}
              className="mobile-nav-cta"
            >
              Start a Project
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
