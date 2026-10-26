import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import api from "../services/api";

function getItems(result, key) {
  if (result.status !== "fulfilled") return [];

  const data = result.value.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function Home() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      api.get("/projects"),
      api.get("/services"),
      api.get("/reels"),
    ]).then((results) => {
      if (!active) return;

      setProjects(
        getItems(results[0], "projects").filter(
          (project) => project.status === "published"
        )
      );
      setServices(
        getItems(results[1], "services").filter(
          (service) => service.isActive !== false
        )
      );
      setReels(
        getItems(results[2], "reels").filter(
          (reel) => reel.isActive !== false
        )
      );

      const failedSections = results
        .map((result, index) =>
          result.status === "rejected"
            ? ["projects", "services", "reels"][index]
            : null
        )
        .filter(Boolean);
      if (failedSections.length) {
        setLoadError(
          `Some portfolio content could not load (${failedSections.join(", ")}). Please try again shortly.`
        );
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const getTitle = (item) =>
    item.title || item.name || item.projectName || "Creative Design";
  const getImage = (item) =>
    item.image?.url ||
    item.imageUrl ||
    item.thumbnail?.url ||
    item.thumbnail ||
    item.coverImage ||
    "";

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-mark" />
              Independent graphic design studio
            </p>
            <h1>
              MAKE YOUR BRAND
              <span> IMPOSSIBLE</span>
              <span className="hero-headline-last"> TO IGNORE.</span>
            </h1>
            <p className="hero-intro">
              We build bold identities and create visuals that stop the scroll,
              start conversations, and stay with people.
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="button button-light">
                Explore Our Work <ArrowRight size={17} />
              </Link>
              <Link to="/contact" className="button button-outline">
                Let&apos;s Talk <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="hero-proof">
              <span>Strategy-led</span>
              <span>Made to stand out</span>
              <span>Built for real people</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Featured graphic design work">
            {projects[0] && getImage(projects[0]) ? (
              <div className="art-photo art-photo-main">
                <img src={getImage(projects[0])} alt={getTitle(projects[0])} />
                <span className="art-caption">Selected work / 01</span>
              </div>
            ) : (
              <div className="art-poster art-poster-main">
                <span className="poster-topline">Ideas with impact</span>
                <span className="poster-big">MAKE<br />IT<br /><i>MATTER.</i></span>
                <span className="poster-index">IG—001 / BRAND STUDIO</span>
              </div>
            )}
            {projects[1] && getImage(projects[1]) ? (
              <div className="art-photo art-photo-small">
                <img src={getImage(projects[1])} alt={getTitle(projects[1])} />
                <span className="art-caption">Selected work / 02</span>
              </div>
            ) : (
              <div className="art-sticker">
                <Sparkles size={21} />
                <span>GOOD<br />DESIGN<br /><b>GETS<br />NOTICED.</b></span>
                <span className="sticker-star">✳</span>
              </div>
            )}
            <div className="art-coordinate">19°04&apos; N<br />72°52&apos; E</div>
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
          <div>
            <p className="eyebrow eyebrow-dark">01 — Selected work</p>
            <h2>Made to leave<br />a mark.</h2>
          </div>
          <Link to="/projects" className="text-link">
            All projects <ArrowUpRight size={17} />
          </Link>
        </div>

        {loadError && (
          <p className="content-notice" role="status">{loadError}</p>
        )}
        {loading ? (
          <div className="loading-line">
            <LoaderCircle size={20} className="animate-spin" />
            Loading selected work
          </div>
        ) : projects.length ? (
          <div className="home-project-grid">
            {projects.slice(0, 3).map((project, index) => (
              <Link
                to="/projects"
                key={project._id || project.id || index}
                className={`home-project-card home-project-card-${index + 1}`}
              >
                <div className="home-project-image">
                  {getImage(project) ? (
                    <img src={getImage(project)} alt={getTitle(project)} loading="lazy" />
                  ) : (
                    <div className="project-art-fallback">
                      <span>IG / {String(index + 1).padStart(2, "0")}</span>
                      <strong>{getTitle(project)}</strong>
                      <span className="fallback-shape" aria-hidden="true" />
                    </div>
                  )}
                  <span className="project-open"><ArrowUpRight size={20} /></span>
                </div>
                <div className="project-meta">
                  <div>
                    <span>{project.category || "Graphic design"}</span>
                    <h3>{getTitle(project)}</h3>
                    <p>{project.description}</p>
                  </div>
                  <span className="project-number">0{index + 1}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-work">
            <span>01 / Portfolio</span>
            <h3>Good work is on its way.</h3>
            <p>Published projects will appear here as they are added to the studio portfolio.</p>
          </div>
        )}
      </section>

      <section className="services-strip section-pad">
        <div className="services-intro">
          <p className="eyebrow">02 — What we do</p>
          <h2>Big ideas.<br /><span>Beautifully made.</span></h2>
          <p>From the first sketch to the final scroll-stopping frame, we make brands impossible to miss.</p>
          <Link to="/services" className="button button-light">
            Explore services <ArrowRight size={17} />
          </Link>
        </div>
        <div className="service-list">
          {loading ? (
            <div className="loading-line"><LoaderCircle size={20} className="animate-spin" />Loading services</div>
          ) : services.length ? (
            services.slice(0, 4).map((service, index) => (
              <Link
                to="/services"
                key={service._id || index}
                className="service-row"
              >
                <span className="service-index">0{index + 1}</span>
                <span className="service-title">{getTitle(service)}</span>
                <ArrowUpRight size={19} />
              </Link>
            ))
          ) : (
            <p className="service-empty">Our creative services will appear here.</p>
          )}
        </div>
      </section>

      <section className="reels-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow-dark">03 — Motion in mind</p>
            <h2>Made to move.</h2>
          </div>
          <Link to="/reels" className="text-link">
            Watch all reels <ArrowUpRight size={17} />
          </Link>
        </div>
        {loading ? (
          <div className="loading-line"><LoaderCircle size={20} className="animate-spin" />Loading reels</div>
        ) : reels.length ? (
          <div className="reel-preview-grid">
            {reels.slice(0, 3).map((reel, index) => (
              <Link to="/reels" key={reel._id || index} className="reel-preview">
                <div className="reel-preview-image">
                  {getImage(reel) ? (
                    <img src={getImage(reel)} alt={getTitle(reel)} loading="lazy" />
                  ) : (
                    <div className="reel-art-fallback"><span>FRAME / 0{index + 1}</span><Play size={32} /></div>
                  )}
                  <span className="reel-play"><Play size={17} fill="currentColor" /></span>
                </div>
                <span className="reel-caption">{reel.category || reel.platform || "Motion design"}</span>
                <h3>{getTitle(reel)}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-work empty-reels">
            <span>03 / Motion</span>
            <h3>More than a still image.</h3>
            <p>Published reels and motion work will appear here.</p>
          </div>
        )}
      </section>

      <section className="contact-banner">
        <div className="contact-banner-inner">
          <p className="eyebrow">Have a good one?</p>
          <h2>LET&apos;S MAKE<br />SOME NOISE.</h2>
          <div className="contact-banner-bottom">
            <p>Bring us your big idea. We&apos;ll bring the right kind of attention.</p>
            <Link to="/contact" className="button button-light">
              Start a conversation <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
