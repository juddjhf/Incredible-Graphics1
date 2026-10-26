
import { useEffect, useState } from "react";
import { Play, Video, ExternalLink } from "lucide-react";
import api from "../services/api";

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await api.get("/reels");
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data.reels || data.data || [];

        setReels(list.filter((reel) => reel.isActive !== false));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Videos load nahi ho paaye. Backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");

      let videoId = "";

      if (host === "youtu.be") {
        videoId = parsed.pathname.slice(1);
      } else if (
        host === "youtube.com" ||
        host === "m.youtube.com"
      ) {
        if (parsed.pathname === "/watch") {
          videoId = parsed.searchParams.get("v") || "";
        } else if (parsed.pathname.startsWith("/embed/")) {
          videoId = parsed.pathname.split("/")[2] || "";
        } else if (parsed.pathname.startsWith("/shorts/")) {
          videoId = parsed.pathname.split("/")[2] || "";
        }
      }

      if (!/^[\w-]{11}$/.test(videoId)) return null;

      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  const getInstagramEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");

      if (host !== "instagram.com") return null;

      const match = parsed.pathname.match(
        /^\/(reel|reels|p)\/([A-Za-z0-9_-]+)\/?/
      );

      if (!match) return null;

      return `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
    } catch {
      return null;
    }
  };

  const getEmbedUrl = (reel) => {
    const url = reel.videoUrl || "";

    if (reel.platform === "YouTube") {
      return getYouTubeEmbedUrl(url);
    }

    if (reel.platform === "Instagram") {
      return getInstagramEmbedUrl(url);
    }

    return null;
  };

  return (
    <main className="editorial-page reels-page min-h-screen bg-[#09090b] px-5 pb-20 pt-28 text-white sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-300">
            <Video size={16} />
            Motion & Creativity
          </div>

          <h1 className="text-4xl font-black sm:text-6xl">
            Reels & <span className="text-fuchsia-400">Videos.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
            Explore video edits, social media reels and creative
            content from the designer's portfolio.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-[9/12] animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-400/20 p-5 text-center text-red-300">
            {error}
          </p>
        ) : reels.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-10 text-center">
            <Video className="mx-auto mb-4 text-gray-500" size={32} />
            <h2 className="text-xl font-bold">Videos coming soon</h2>
            <p className="mt-2 text-gray-400">
              The designer's reels and videos will appear here.
            </p>
          </div>
        ) : (
          <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reels.map((reel) => {
              const embedUrl = getEmbedUrl(reel);

              return (
                <article
                  key={reel._id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-fuchsia-400/40"
                >
                  {embedUrl ? (
                    <div className="aspect-[9/12] bg-black">
                      <iframe
                        src={embedUrl}
                        title={reel.title}
                        className="h-full w-full border-0"
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  ) : (
                    <a
                      href={reel.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex aspect-[9/12] flex-col items-center justify-center gap-4 bg-[#171720] p-6 text-center"
                    >
                      {reel.thumbnail?.url && (
                        <img
                          src={reel.thumbnail.url}
                          alt={`${reel.title || "Reel"} thumbnail`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover opacity-60 transition group-hover:opacity-40"
                        />
                      )}

                      <span className="button-primary relative flex h-14 w-14 items-center justify-center rounded-full text-white">
                        <Play size={24} fill="currentColor" />
                      </span>

                      <span className="relative flex items-center gap-2 text-sm font-semibold">
                        Watch Video
                        <ExternalLink size={16} />
                      </span>
                    </a>
                  )}

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
                        {reel.platform || "Video"}
                      </span>

                      {reel.category && (
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                          {reel.category}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-bold">
                      {reel.title}
                    </h2>

                    {reel.description && (
                      <p className="mt-2 leading-6 text-gray-400">
                        {reel.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Reels;
