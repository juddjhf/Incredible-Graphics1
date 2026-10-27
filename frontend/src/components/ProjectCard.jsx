
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectArtwork from "./ProjectArtwork";

const ProjectCard = ({ project, featured = false }) => {
  return (
    <Link
      to={project._id ? `/projects/${project._id}` : "/projects"}
      className={`project-card group${featured ? " project-card--featured" : ""}`}
      aria-label={`View ${project.title} project details`}
    >
      <ProjectArtwork project={project} />
      {featured && <span className="project-card-featured">Featured Project</span>}
      <div className="project-card-copy">
        <p className="project-card-category">{project.category || "Graphic Design"}</p>
        <div className="project-card-title">
          <h2>{project.title}</h2>
          <span className="project-card-arrow" aria-hidden="true">
            <ArrowUpRight size={19} />
          </span>
        </div>
        <p className="project-card-description">{project.description}</p>
        {project.tags?.length > 0 && (
          <div className="project-card-tags">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
