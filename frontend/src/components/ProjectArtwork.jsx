import { useState } from "react";

const artworkByCategory = {
  Branding: "photo-1544816155-12df9643f363",
  "Logo Design": "photo-1558655146-9f40138edfeb",
  "Social Media Design": "photo-1550745165-9bc0b252726f",
  "YouTube Thumbnail": "photo-1531058020387-3be344556be6",
  "Poster Design": "photo-1513364776144-60967b0f800f",
  "UI/UX Design": "photo-1523726491678-bf852e717f6a",
  Other: "photo-1542291026-7eec264c27ff",
};

function ProjectArtwork({ project, className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = project.image?.url || project.imageUrl || "";
  const usingFallback = !image || imageFailed;
  const fallbackImage = `https://images.unsplash.com/${artworkByCategory[project.category] || artworkByCategory.Other}?auto=format&fit=crop&w=1200&q=85`;

  return (
    <div
      className={`project-artwork ${className}${usingFallback ? " has-fallback-art" : ""}`}
      data-category={project.category || "Other"}
      role="img"
      aria-label={`${project.category || "Graphic design"} artwork for ${project.title}`}
    >
      {image && !imageFailed ? (
        <img
          src={image}
          alt={project.title}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <>
          <img
            src={fallbackImage}
            alt=""
            aria-hidden="true"
            className="project-artwork-fallback-image"
            onError={(event) => { event.currentTarget.hidden = true; }}
          />
          <span className="project-artwork-label">Incredible Graphics · Selected work</span>
          <strong>{project.title || "Untitled project"}</strong>
          <span className="project-artwork-orbit" aria-hidden="true" />
          <span className="project-artwork-cut" aria-hidden="true" />
          <span className="project-artwork-caption">{project.category || "Graphic design"} · Selected project</span>
        </>
      )}
    </div>
  );
}

export default ProjectArtwork;
