import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  Image,
  LoaderCircle,
  Megaphone,
  Package,
  PenTool,
  Share2,
  Shapes,
  Sparkles,
} from "lucide-react";
import api from "../services/api";
import Button from "../components/Button";

const serviceCategories = [
  { title: "Brand Identity", icon: Fingerprint, terms: ["brand identity", "branding"], detail: "Build a cohesive visual language that makes your brand easy to recognize and remember." },
  { title: "Logo Design", icon: PenTool, terms: ["logo"], detail: "Create a distinctive, versatile mark that works from a tiny icon to a storefront." },
  { title: "Social Media Design", icon: Share2, terms: ["social media", "social"], detail: "Bring a consistent look to your posts, stories, launches and everyday content." },
  { title: "Poster Design", icon: Image, terms: ["poster"], detail: "Turn a message, event or campaign into a bold composition people notice." },
  { title: "Packaging Design", icon: Package, terms: ["packaging", "package"], detail: "Give your product clear shelf presence with thoughtful, considered packaging." },
  { title: "Marketing Materials", icon: Megaphone, terms: ["marketing", "print", "brochure"], detail: "Keep print and digital materials aligned across every customer touchpoint." },
  { title: "Custom Design", icon: Shapes, terms: ["custom", "graphic"], detail: "Get focused creative support shaped around your brief and your audience." },
];

const processSteps = [
  ["01", "Discover", "Understand the brand, audience, goals and creative brief."],
  ["02", "Concept", "Explore references, develop concepts and establish the visual direction."],
  ["03", "Design", "Create, refine and polish the selected design with attention to detail."],
  ["04", "Deliver", "Prepare final assets in the required formats and organize files for handoff."],
];

const artworkImages = [
  "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
];

const demoProjects = [
  {
    title: "Signal / AI Branding",
    category: "AI Branding",
    description: "A concept identity exploring clarity, connection and emerging technology.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85",
    demo: true,
  },
  {
    title: "Form / Logo System",
    category: "Logo Design",
    description: "A flexible logo direction for a contemporary, design-minded label.",
    image: "https://images.unsplash.com/photo-1634942536790-2536a4b7f1a3?auto=format&fit=crop&w=1000&q=85",
    demo: true,
  },
  {
    title: "After Hours / Campaign",
    category: "Social Media Creatives",
    description: "A sample social campaign built around bold color and a clear point of view.",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=85",
    demo: true,
  },
  {
    title: "New Perspectives",
    category: "Poster Design",
    description: "An editorial poster concept that brings a cultural event into focus.",
    image: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?auto=format&fit=crop&w=1000&q=85",
    demo: true,
  },
  {
    title: "Daily Ritual / Packaging",
    category: "Packaging Design",
    description: "A packaging study balancing a quiet palette with confident typography.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
    demo: true,
  },
  {
    title: "Common Ground",
    category: "Brand Identity",
    description: "A sample identity system connecting a warm tone of voice with a bold visual world.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85",
    demo: true,
  },
];

const getTitle = (item) => item.title || item.name || item.projectName || "Creative Design";
const getImage = (item) =>
  item.image?.url || item.imageUrl || item.thumbnail?.url || item.thumbnail || item.coverImage || "";

function getItems(result, key) {
  if (result.status !== "fulfilled") return [];
  const data = result.value.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function Home() {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.allSettled([api.get("/projects"), api.get("/services")]).then((results) => {
      if (!active) return;

      setProjects(
        getItems(results[0], "projects").filter((project) => project.status === "published")
      );
      setServices(
        getItems(results[1], "services").filter((service) => service.isActive !== false)
      );

      const failedSections = results
        .map((result, index) =>
          result.status === "rejected" ? ["projects", "services"][index] : null
        )
        .filter(Boolean);
      if (failedSections.length) {
        setLoadError(
          `Some studio content could not load (${failedSections.join(", ")}). Please try again shortly.`
        );
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!location.hash || loading) return undefined;

    const scrollFrame = requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(scrollFrame);
  }, [location.hash, loading]);

  useEffect(() => {
    const elements = document.querySelectorAll(".home-page .reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const featuredProjects = projects.filter((project) => project.featured);
  const remainingProjects = projects.filter((project) => !featuredProjects.includes(project));
  const liveProjects = [...featuredProjects, ...remainingProjects].slice(0, 6);
  const selectedProjects = [
    ...liveProjects,
    ...demoProjects.slice(0, Math.max(0, 6 - liveProjects.length)),
  ];

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-mark" />Creative graphic designer</p>
            <h1>
              <span className="hero-headline-first">We Turn Ideas Into</span>
              <span className="hero-headline-last">Visual Impact.</span>
            </h1>
            <p className="hero-intro">
              Professional graphic design that brings your brand to life. From logos to
              social media, we create designs that make your business stand out.
            </p>
            <div className="hero-actions">
              <Button to="/projects" variant="primary">Explore Our Work</Button>
              <Button to="/contact" variant="secondary">Let&apos;s Work Together</Button>
            </div>
            <div className="hero-stats" aria-label="Studio capabilities">
              <div><strong>Brand</strong><small>Identity & strategy</small></div>
              <div><strong>Digital</strong><small>Social & campaigns</small></div>
              <div><strong>Print</strong><small>Packaging & posters</small></div>
            </div>
          </div>

          <div className="hero-art" aria-label="A collage of graphic design artwork">
            <div className="collage-image collage-portrait">
              <img src={artworkImages[2]} alt="Fashion portrait in a dramatic art direction" />
              <span className="collage-image-wash" />
              <span className="collage-image-caption">Art direction / 01</span>
            </div>
            <div className="collage-poster collage-poster-black">
              <span>GOOD DESIGN</span><strong>BUILDS<br />BRANDS.</strong><small>INDEPENDENT CREATIVE STUDIO</small>
            </div>
            <div className="collage-poster collage-poster-red">
              <small>IN / OUT OF THE BOX</small><strong>CREATIVE<br />DESIGN<br />STUDIO</strong>
              <span>IDENTITY · CAMPAIGN · PACKAGING</span>
            </div>
            <div className="collage-image collage-product">
              <img src={artworkImages[0]} alt="A carefully composed printed design object" />
              <span className="collage-product-mark">IG</span>
            </div>
            <div className="collage-seal"><span>Ideas with<br />impact</span><ArrowRight size={17} /></div>
            <div className="collage-edition">IG—001 <span>VISUAL SYSTEMS</span></div>
          </div>
        </div>
        <div className="hero-bottomline">
          <span>Incredible Graphics®</span>
          <span>Branding / Digital / Motion</span>
          <a href="#selected-work">Scroll to explore ↓</a>
        </div>
      </section>

      <section className="work-section section-pad" id="selected-work">
        <div className="section-heading">
          <div><p className="eyebrow">01 — Selected work</p><h2>Featured Work</h2></div>
          <Link to="/projects" className="text-link">View all projects <ArrowUpRight size={17} /></Link>
        </div>
        {loadError && <p className="content-notice" role="status">{loadError}</p>}
        {loading ? (
          <div className="loading-line"><LoaderCircle size={20} className="animate-spin" />Loading selected work</div>
        ) : selectedProjects.length ? (
          <>
            <div className="home-project-grid">
            {selectedProjects.map((project, index) => (
              <Link
                to={project._id ? `/projects/${project._id}` : "/projects"}
                key={project._id || project.id || index}
                className={`home-project-card home-project-card-${index + 1}`}
              >
                <div className="home-project-image">
                  <div className={`project-art-fallback artwork-${(index % 4) + 1}`} aria-hidden="true">
                    <span>{project.demo ? "STUDIO CONCEPT · DEMO" : "IN / INCREDIBLE GRAPHICS"}</span>
                    <strong>{getTitle(project)}</strong>
                    <small>{project.category || "Brand identity"}</small>
                  </div>
                  {getImage(project) ? (
                    <>
                      <img
                        src={getImage(project)}
                        alt={getTitle(project)}
                        loading="lazy"
                        onError={(event) => { event.currentTarget.hidden = true; }}
                      />
                      {project.demo && <span className="project-demo-label">Studio concept · Demo</span>}
                    </>
                  ) : (
                    null
                  )}
                  <span className="project-open"><ArrowUpRight size={20} /></span>
                </div>
                <div className="project-meta">
                  <div>
                    <span>{project.category || "Graphic design"}{project.demo ? " · Studio concept" : ""}</span>
                    <h3>{getTitle(project)}</h3>
                    <p>{project.description || "A selected visual identity and design direction."}</p>
                  </div>
                  <span className="project-number">0{index + 1}</span>
                </div>
              </Link>
            ))}
            </div>
            {selectedProjects.some((project) => project.demo) && (
              <p className="portfolio-demo-note">
                <Sparkles size={14} /> Demo concepts are clearly marked; published portfolio work is loaded from the studio projects.
              </p>
            )}
          </>
        ) : (
          <div className="empty-work">
            <span>01 / Portfolio</span>
            <h3>Good work is on its way.</h3>
            <p>Published projects will appear here as they are added to the studio portfolio.</p>
          </div>
        )}
      </section>

      <section className="services-strip section-pad reveal-on-scroll" id="services">
        <div className="section-heading">
          <div><p className="eyebrow">02 — Our services</p><h2>Design for every<br />kind of big idea.</h2></div>
          <Link to="/services" className="text-link">View all services <ArrowUpRight size={17} /></Link>
        </div>
        <p className="services-intro">
          We pair clear thinking with considered craft—so every identity, campaign and graphic
          communicates with purpose and feels unmistakably yours.
        </p>
        <div className="service-cards">
          {serviceCategories.map((service, index) => {
            const Icon = service.icon;
            const liveService = services.find((item) =>
              service.terms.some((term) =>
                `${item.title || ""} ${item.category || ""}`.toLowerCase().includes(term)
              )
            );
            return (
              <Link to="/services" key={service.title} className="service-card">
                <span className="service-card-icon"><Icon size={21} strokeWidth={1.7} /></span>
                <span className="service-card-index">0{index + 1}</span>
                <strong>{liveService?.title || service.title}</strong>
                <small>{service.detail}</small>
              </Link>
            );
          })}
        </div>
        <div className="services-cta">
          <p>Need a custom design? <span>Let&apos;s discuss your project.</span></p>
          <Button to="/contact" variant="secondary">Tell us about it</Button>
        </div>
      </section>

      <section className="process-section section-pad reveal-on-scroll">
        <div className="section-heading">
          <div><p className="eyebrow">03 — Creative process</p><h2>Good work, made<br />with purpose.</h2></div>
          <p className="process-intro">From first idea to final file, our process makes room for the details that make a difference.</p>
        </div>
        <div className="process-grid">
          {processSteps.map(([number, title, description]) => (
            <article className="process-card" key={number}>
              <span className="process-number">{number}<i /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-proof section-pad reveal-on-scroll" id="about">
        <div className="about-panel">
          <div className="studio-portrait">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85" alt="Portrait of a creative professional" loading="lazy" />
            <span>INDEPENDENT<br />BY DESIGN</span>
          </div>
          <div className="about-copy">
            <p className="eyebrow">04 — About the studio</p>
            <h2>Ideas deserve<br /><span>to be seen.</span></h2>
            <p>
              Incredible Graphics is an independent creative studio helping brands
              communicate visually with clarity, character and purpose. We turn the
              heart of an idea into a visual language people can recognize and connect with.
            </p>
            <p>
              Our approach starts by listening, then brings brand thinking and thoughtful
              design together—so the finished work feels considered, consistent and true to you.
            </p>
            <div className="capability-tags" aria-label="Studio capabilities">
              <span>Brand Strategy</span><span>Visual Identity</span><span>Campaign Design</span>
            </div>
            <Link to="/contact" className="text-link">Let&apos;s Get to Know Each Other <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <div className="testimonials-panel">
          <div className="testimonials-heading">
            <p className="eyebrow">Kind words</p>
            <span>Sample testimonials</span>
          </div>
          <article className="testimonial-card">
            <span className="testimonial-mark">&ldquo;</span>
            <p>Thoughtful design, clear communication and a process built around the idea.</p>
            <div className="testimonial-credit"><strong>Sample client</strong><small>Brand identity · Sample copy</small></div>
          </article>
          <article className="testimonial-card">
            <span className="testimonial-mark">&ldquo;</span>
            <p>From the first sketch to the final details, every part of the work has a purpose.</p>
            <div className="testimonial-credit"><strong>Sample client</strong><small>Campaign design · Sample copy</small></div>
          </article>
        </div>
      </section>

      <section className="contact-banner reveal-on-scroll">
        <div className="contact-banner-inner">
          <p className="eyebrow">Your next big idea starts here</p>
          <div className="contact-banner-content">
            <h2>Make Your Brand<br /><span>Impossible to Ignore.</span></h2>
            <div className="contact-banner-copy">
              <p>Let&apos;s create bold visuals that make your business stand out.</p>
              <Button to="/contact" variant="primary">Start a Project</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
