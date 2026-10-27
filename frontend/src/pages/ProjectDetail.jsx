import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, LoaderCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import ProjectArtwork from "../components/ProjectArtwork";
import ProjectCard from "../components/ProjectCard";
import Button from "../components/Button";

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedError, setRelatedError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProject = async () => {
      setLoading(true);
      setError("");

      const [projectResult, projectsResult] = await Promise.allSettled([
        api.get(`/projects/${id}`),
        api.get("/projects"),
      ]);

      if (!active) return;

      if (projectResult.status === "fulfilled") {
        const data = projectResult.value.data;
        setProject(data?.project || data?.data || null);
      } else {
        setError(
          projectResult.reason.response?.data?.message ||
            "This project could not be loaded. Please try again."
        );
      }

      if (projectsResult.status === "fulfilled") {
        const data = projectsResult.value.data;
        const list = Array.isArray(data)
          ? data
          : data.projects || data.data || [];
        setRelatedProjects(
          list
            .filter((item) => item.status === "published" && item._id !== id)
            .slice(0, 3)
        );
      } else {
        setRelatedError("Related projects could not be loaded.");
      }

      setLoading(false);
    };

    fetchProject();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="project-detail-state">
        <LoaderCircle size={24} className="animate-spin" />
        <p>Loading project</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-detail-state" role={error ? "alert" : undefined}>
        <p>{error || "This project could not be found."}</p>
        <Button to="/projects" variant="secondary" icon={<ArrowLeft size={16} />} iconPosition="start" showArrow={false}>
          Back to portfolio
        </Button>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <div className="project-detail-top">
        <Link to="/projects" className="project-detail-back">
          <ArrowLeft size={17} /> Back to all work
        </Link>
        <span>Incredible Graphics · Selected work</span>
      </div>

      <section className="project-detail-hero">
        <div className="project-detail-copy">
          <p className="eyebrow">{project.category || "Graphic Design"}</p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className="project-detail-actions">
            <Button to="/contact" variant="primary">Start a project</Button>
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="project-detail-external"
              >
                Visit project <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        </div>
        <ProjectArtwork project={project} className="project-detail-artwork" />
      </section>

      <section className="project-detail-information">
        <div>
          <span>01 / The project</span>
          <h2>A closer look.</h2>
        </div>
        <p>{project.description}</p>
        {project.tags?.length > 0 && (
          <div className="project-detail-tags" aria-label="Project tags">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
      </section>

      <section className="project-detail-related">
        <div className="project-detail-related-heading">
          <div>
            <span>More from the studio</span>
            <h2>Related projects</h2>
          </div>
          <Link to="/projects" className="project-detail-external">
            View all work <ArrowUpRight size={17} />
          </Link>
        </div>
        {relatedError ? (
          <p role="status">{relatedError}</p>
        ) : relatedProjects.length ? (
          <div className="project-detail-related-grid">
            {relatedProjects.map((relatedProject) => (
              <ProjectCard key={relatedProject._id} project={relatedProject} />
            ))}
          </div>
        ) : (
          <p className="project-detail-related-empty">More selected work is on its way.</p>
        )}
      </section>
    </main>
  );
}

export default ProjectDetail;
