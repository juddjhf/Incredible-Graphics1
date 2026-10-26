
import { useEffect, useState } from "react";
import { Palette, Search } from "lucide-react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";

const categories = [
  "All",
  "Logo Design",
  "Branding",
  "Social Media Design",
  "YouTube Thumbnail",
  "Poster Design",
  "UI/UX Design",
  "Other",
];

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
            "Projects load nahi ho paaye. Backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "All" ||
      project.category === selectedCategory;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      project.title?.toLowerCase().includes(searchText) ||
      project.description?.toLowerCase().includes(searchText) ||
      project.tags?.some((tag) =>
        tag.toLowerCase().includes(searchText)
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="editorial-page projects-page min-h-screen bg-[#09090b] px-5 pb-20 pt-28 text-white sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-300">
            <Palette size={16} />
            Creative Portfolio
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Selected{" "}
            <span className="text-fuchsia-400">Projects.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
            Explore graphic designs, brand identities, social media
            creatives and other visual projects.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-xl items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <Search size={19} className="shrink-0 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects or tags..."
            aria-label="Search projects"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedCategory === category
                  ? "border-fuchsia-400 bg-fuchsia-500 text-white"
                  : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-fuchsia-400/50"
              }`}
            >
              {category}
            </button>
          ))}
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
          <div className="rounded-2xl border border-white/10 p-10 text-center">
            <Palette className="mx-auto mb-4 text-gray-500" size={32} />
            <h2 className="text-xl font-bold">No projects found</h2>
            <p className="mt-2 text-gray-400">
              Search change karo ya doosri category select karo.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-400">
              {filteredProjects.length} project(s) found
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Projects;
