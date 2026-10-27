
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, ClipboardList, LoaderCircle } from "lucide-react";
import api from "../services/api";
import Button from "../components/Button";

const initialForm = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  service: "",
  projectTitle: "",
  projectDescription: "",
  budget: "",
  deadline: "",
  referenceLinks: "",
};

const Order = () => {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    ...initialForm,
    service: searchParams.get("service") || "",
  });
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : data.services || data.data || [];

        setServices(list.filter((item) => item.isActive !== false));
      } catch {
        setError("Services load nahi ho paayi. Page refresh karke try karo.");
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        budget: form.budget === "" ? undefined : Number(form.budget),
        deadline: form.deadline || undefined,
        referenceLinks: form.referenceLinks
          .split("\n")
          .map((link) => link.trim())
          .filter(Boolean),
      };

      await api.post("/orders", payload);

      setMessage(
        "Order request successfully submit ho gayi! Client se contact karne ke liye details receive ho gayi hain."
      );

      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Request submit nahi hui. Details check karke dobara try karo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#111119] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-fuchsia-400";

  return (
    <main className="editorial-page order-page min-h-screen bg-[#09090b] px-5 pb-20 pt-28 text-white sm:px-8">
      <section className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-300">
            <ClipboardList size={16} />
            Start a Project
          </div>

          <h1 className="text-4xl font-black sm:text-5xl">
            Let's Work <span className="text-fuchsia-400">Together.</span>
          </h1>

          <p className="mt-4 leading-7 text-gray-400">
            Apne project ki details share karo. Hum request review karke
            aage ki discussion kar sakte hain.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="clientName" className="text-sm text-gray-300">
                Full Name *
              </label>
              <input
                id="clientName"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your name"
                autoComplete="name"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="clientEmail" className="text-sm text-gray-300">
                Email Address *
              </label>
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={form.clientEmail}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@example.com"
                autoComplete="email"
                required
                maxLength={254}
              />
            </div>

            <div>
              <label htmlFor="clientPhone" className="text-sm text-gray-300">
                Phone Number *
              </label>
              <input
                id="clientPhone"
                name="clientPhone"
                type="tel"
                value={form.clientPhone}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your contact number"
                autoComplete="tel"
                required
                maxLength={20}
              />
            </div>

            <div>
              <label htmlFor="service" className="text-sm text-gray-300">
                Select Service *
              </label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loadingServices}
              >
                <option value="">
                  {loadingServices ? "Loading services..." : "Choose a service"}
                </option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="projectTitle" className="text-sm text-gray-300">
              Project Title *
            </label>
            <input
              id="projectTitle"
              name="projectTitle"
              value={form.projectTitle}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Instagram brand identity"
              required
              maxLength={150}
            />
          </div>

          <div>
            <label
              htmlFor="projectDescription"
              className="text-sm text-gray-300"
            >
              Project Requirements *
            </label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              value={form.projectDescription}
              onChange={handleChange}
              className={`${inputClass} min-h-32 resize-y`}
              placeholder="Describe what you need..."
              required
              minLength={10}
              maxLength={5000}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className="text-sm text-gray-300">
                Budget (₹)
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                value={form.budget}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your estimated budget"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="text-sm text-gray-300">
                Preferred Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={form.deadline}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="referenceLinks"
              className="text-sm text-gray-300"
            >
              Reference Links (optional)
            </label>
            <textarea
              id="referenceLinks"
              name="referenceLinks"
              value={form.referenceLinks}
              onChange={handleChange}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder={"Add one URL per line"}
            />
            <p className="mt-2 text-xs text-gray-500">
              Sirf links share karo jinhe client ko review karna chahiye.
            </p>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="rounded-xl bg-green-500/10 p-4 text-sm text-green-300">
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={loadingServices || services.length === 0}
            loading={submitting}
            variant="primary"
            showArrow={false}
            icon={submitting ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={17} />}
            className="order-submit"
          >
            {submitting ? "Submitting..." : "Submit Project Request"}
          </Button>

          <p className="text-center text-xs leading-5 text-gray-500">
            This is a project inquiry, not an online payment. Pricing and
            project details can be confirmed after discussion.
          </p>
        </form>
      </section>
    </main>
  );
};

export default Order;
