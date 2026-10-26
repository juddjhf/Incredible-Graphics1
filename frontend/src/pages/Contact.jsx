
import { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  LoaderCircle,
  Palette,
} from "lucide-react";
import api from "../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await api.post("/contact", formData);

      setSuccess(
        response.data?.message ||
          "Your message has been sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Message send nahi hua. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: Mail,
      title: "Email",
      value: "Send an enquiry",
      href: "#contact-form",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "India",
      href: null,
    },
  ];

  return (
    <main className="editorial-page contact-page min-h-screen bg-[#09090b] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <Palette size={16} />
            Let's Work Together
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Let's Create Something{" "}
            <span className="text-violet-400">Amazing</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Have a project in mind? Share your ideas with us.
            Let's discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact Information */}
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                Contact Information
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                Tell us about your design requirements, project,
                or collaboration idea.
              </p>

              <div className="mt-8 space-y-6">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                        <Icon size={21} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          {item.title}
                        </p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-1 break-all text-sm text-gray-200 transition hover:text-violet-300 sm:text-base"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-gray-200">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="mb-4 font-medium">
                  Connect With Us
                </h3>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-violet-500 hover:text-violet-300"
                  >
                    Instagram
                  </a>

                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-violet-500 hover:text-violet-300"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-violet-500/20 bg-violet-500/[0.07] p-6">
              <h3 className="text-lg font-semibold">
                Have a creative idea?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                From social media graphics to branding and
                video editing, let's discuss your next project.
              </p>
            </div>
          </section>

          {/* Contact Form */}
          <section id="contact-form" className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:col-span-3">
            <h2 className="text-2xl font-semibold">
              Send Us a Message
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Fill in the details below and we'll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Full Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-white/10 bg-[#111116] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    className="w-full rounded-xl border border-white/10 bg-[#111116] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={20}
                    className="w-full rounded-xl border border-white/10 bg-[#111116] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Subject *
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is your project about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    className="w-full rounded-xl border border-white/10 bg-[#111116] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm text-gray-300"
                >
                  Your Message *
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell us about your project, requirements, and ideas..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={5000}
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#111116] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
                />
              </div>

              {success && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300"
                >
                  <CheckCircle2 size={20} className="shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="button-primary flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={20} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Contact;
