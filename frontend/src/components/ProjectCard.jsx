
import { ArrowUpRight } from "lucide-react";

const ProjectCard = ({ project }) => {
  return (
    <article className="project-card group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-fuchsia-400/50">
      <div className="aspect-[4/3] overflow-hidden bg-[#191922]">
        {project.image?.url ? (
          <img
            src={project.image.url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No preview available
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-fuchsia-400">
          {project.category || "Graphic Design"}
        </p>

        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold">{project.title}</h3>

          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title}`}
              className="button-icon shrink-0"
            >
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
          {project.description}
        </p>

        {project.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
