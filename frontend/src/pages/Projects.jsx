
import { useEffect, useState } from "react";
import { Palette, Search } from "lucide-react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import Button from "../components/Button";

const categories = [
  "All",
  "Branding",
  "Logos",
  "Social Media",
  "Posters",
  "Packaging",
  "Other",
];

const categoryTerms = {
  Branding: ["brand"],
  Logos: ["logo"],
  "Social Media": ["social media", "social", "instagram"],
  Posters: ["poster"],
  Packaging: ["packaging", "package"],
  Other: ["other", "custom"],
};

function matchesCategory(project, category) {
  if (category === "All") return true;

  const projectTerms = [
    project.category,
    ...(Array.isArray(project.tags) ? project.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return categoryTerms[category].some((term) => projectTerms.includes(term));
}

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/projects");
        const data = response.data;

        const projectList = Array.isArray(data)
          ? data
          : data.projects || data.data || [];

        setProjects(
          projectList.filter(
            (project) => project.status === "published"
          )
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Projects could not be loaded. Please check the connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase().trim();
    const searchableText = [
      project.title,
      project.category,
      project.description,
      ...(Array.isArray(project.tags) ? project.tags : []),
    ]
      .filter((value) => typeof value === "string")
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchText);

    return matchesCategory(project, selectedCategory) && matchesSearch;
  });

  return (
    <main className="editorial-page projects-page min-h-screen bg-[#09090b] px-5 pb-20 pt-28 text-white sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="portfolio-hero">
          <div className="portfolio-heading">
            <div className="portfolio-eyebrow">
              <Palette size={15} aria-hidden="true" />
              Selected work
            </div>

            <h1>
              A few things we&apos;ve <span>made.</span>
            </h1>

            <p>
              A selection of identities, campaigns and visual ideas made to
              leave a lasting impression.
            </p>
          </div>
          <div className="portfolio-hero-art" aria-hidden="true">
            <span className="portfolio-hero-art-orbit" />
            <span className="portfolio-hero-art-frame">
              <span>IG / SELECTED WORK</span>
              <strong>Ideas<br />in focus.</strong>
              <span>BRAND · IMAGE · IMPACT</span>
            </span>
          </div>
        </div>

        <div className="portfolio-toolbar">
          <div className="portfolio-filters" aria-label="Filter projects by category">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                variant="filter"
                showArrow={false}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={selectedCategory === category ? "is-selected" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
          <label className="portfolio-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, categories or tags"
              aria-label="Search projects, categories or tags"
            />
          </label>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-center text-red-300">
            {error}
          </p>
        ) : filteredProjects.length === 0 ? (
          <div className="portfolio-empty-state">
            <Palette className="mx-auto mb-4 text-gray-500" size={30} aria-hidden="true" />
            <h2>No projects found</h2>
            <p>Try a different search or category to explore the work.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <p className="portfolio-result-count" role="status" aria-live="polite">
              Showing <strong>{filteredProjects.length}</strong>{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </p>

            <div className="portfolio-grid">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  featured={index === 0}
                />
              ))}
            </div>
          </>
        )}

        <section className="portfolio-cta" aria-labelledby="portfolio-cta-title">
          <div>
            <p>Have an idea taking shape?</p>
            <h2 id="portfolio-cta-title">
              Have a project in mind? <span>Let&apos;s make it stand out.</span>
            </h2>
          </div>
          <Button to="/contact" variant="primary">
            Start a Project
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Projects;
