
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock, Palette, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data.services || data.data || [];

        setServices(list.filter((service) => service.isActive !== false));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Services load nahi ho paayi. Backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className="editorial-page services-page min-h-screen bg-[#09090b] px-5 pb-20 pt-28 text-white sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-300">
            <Palette size={16} />
            What I Offer
          </div>

          <h1 className="text-4xl font-black sm:text-6xl">
            Creative <span className="text-fuchsia-400">Services.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
            Design services to help your brand stand out with
            professional, creative and memorable visuals.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-400/20 p-5 text-center text-red-300">
            {error}
          </p>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-10 text-center">
            <Palette className="mx-auto mb-4 text-gray-500" size={32} />
            <h2 className="text-xl font-bold">Services coming soon</h2>
            <p className="mt-2 text-gray-400">
              New creative services will be added here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-fuchsia-400/50"
              >
                {service.image?.url && (
                  <img
                    src={service.image.url}
                    alt={service.title}
                    loading="lazy"
                    className="mb-6 aspect-video w-full rounded-xl object-cover"
                  />
                )}

                <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400">
                  {service.category || "Creative Service"}
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  {service.title}
                </h2>

                <p className="mt-3 flex-1 leading-7 text-gray-400">
                  {service.description}
                </p>

                <div className="my-6 flex flex-wrap gap-4 border-y border-white/10 py-4 text-sm text-gray-300">
                  {service.price != null && (
                    <span className="font-semibold text-white">
                      {Number(service.price) === 0
                        ? "Price on request"
                        : `₹${Number(service.price).toLocaleString("en-IN")}`}
                    </span>
                  )}

                  {service.deliveryDays != null && (
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-fuchsia-400" />
                      {service.deliveryDays} day(s)
                    </span>
                  )}
                </div>

                {service.features?.length > 0 && (
                  <ul className="mb-6 space-y-3">
                    {service.features.map((feature, index) => (
                      <li
                        key={`${service._id}-${index}`}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-fuchsia-400"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  to={`/order?service=${encodeURIComponent(service._id)}`}
                  className="button button-primary mt-auto flex items-center justify-center gap-2 normal-case tracking-normal"
                >
                  Order This Service
                  <ArrowUpRight size={18} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Services;
