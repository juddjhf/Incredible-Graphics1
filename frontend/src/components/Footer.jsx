import { Link } from "react-router-dom";
import {
  Mail,
  ArrowUp,
  Camera,
  BriefcaseBusiness,
} from "lucide-react";
import Button from "./Button";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/#about" },
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
              <span className="site-brand-mark" aria-hidden="true">IG</span>
              <span className="site-brand-name">Incredible <b>Graphics</b></span>
            </Link>
            <p className="site-footer-copy">
              Creative identities, impactful graphics and scroll-stopping
              visuals that help brands stand out.
            </p>
            <Button to="/contact" variant="text" className="site-footer-talk">
              Let&apos;s work together
            </Button>
          </div>

          <div className="site-footer-column footer-explore">
            <h3>Explore</h3>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-column footer-contact">
            <h3>Get in touch</h3>
            <p className="site-footer-copy">
              Have a project in mind? Send us a note through the inquiry form.
            </p>
            <Button to="/contact" variant="text" className="site-footer-contact" showArrow={false} icon={<Mail size={17} />}>
              Send an enquiry
            </Button>
            <div className="site-footer-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Camera size={16} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <BriefcaseBusiness size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {currentYear} Incredible Graphics. All rights reserved.</p>
          <div className="site-footer-bottom-links">
            <Link to="/contact">Contact</Link>
            <a href="#top" className="site-footer-top">Back to top <ArrowUp size={15} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
