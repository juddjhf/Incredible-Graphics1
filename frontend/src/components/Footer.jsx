import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  ArrowUp,
} from "lucide-react";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "Reels", path: "/reels" },
  { name: "Contact", path: "/contact" },
];

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link to="/" className="site-brand">
              <img
                src="/incredible-logo.png"
                alt="Incredible Graphics logo"
                className="site-brand-mark"
              />
              <span className="site-brand-name">Incredible <b>Graphics</b></span>
            </Link>
            <p className="site-footer-copy">
              Creative identities, impactful graphics and scroll-stopping
              visuals that help brands stand out.
            </p>
            <Link to="/contact" className="site-footer-talk">
              Let&apos;s work together <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="site-footer-column">
            <h3>Explore</h3>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
              <li><Link to="/order">Start a project</Link></li>
            </ul>
          </div>

          <div className="site-footer-column">
            <h3>Start something</h3>
            <p className="site-footer-copy">
              Have a design project in mind? Tell us what you&apos;re imagining.
            </p>
            <Link to="/contact" className="site-footer-contact">
              <Mail size={17} />
              Let&apos;s talk about it
            </Link>
            <div className="site-footer-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {currentYear} Incredible Graphics. All rights reserved.</p>
          <Link to="/" className="site-footer-top">
            Back to top <ArrowUp size={15} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
