import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState, type ComponentProps, type FormEvent } from 'react';
import { Reveal, MaskLines, DiamondMark } from './ui/primitives';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-0 py-3 bg-transparent border-0 border-b border-ink/20 focus:border-copper rounded-none text-ink placeholder:text-steel/70 outline-none transition-colors focus:ring-0';

  const labelClass = 'block label-tech text-ink/45 mb-1';

  return (
    <section id="contact" data-theme="light" className="relative overflow-hidden">
      {/* ============ DEEP NAVY → STEEL NAVY opening statement ============ */}
      <div
        className="relative"
        style={{
          background:
            'linear-gradient(180deg, #071A2F 0%, #0B233D 46%, #163A58 100%)',
        }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <Reveal>
            <span className="kicker kicker--light">Scene 07 — Contact</span>
          </Reveal>
          <MaskLines
            as="h2"
            className="display-tight text-ivory text-[clamp(2.6rem,6.4vw,6rem)] mt-5"
            lines={[
              "Let's Get",
              <span key="t" className="font-display italic font-light text-champagne">In Touch.</span>,
            ]}
          />
          <Reveal delay={0.12}>
            <p className="mt-6 text-ivory/60 text-[15px] leading-[1.9] max-w-md">
              Have an inquiry or need custom specifications? Reach out to us
              and our team will get back to you promptly.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ============ steel → mineral resolve, the form as final scene ============ */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(180deg, #163A58 0%, #4d5f70 26%, #E7E4DC 58%)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pt-[16vh] sm:pt-[20vh] pb-24 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
            {/* Information */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="space-y-9">
                  {/* Office address */}
                  <div className="flex items-start gap-5">
                    <span className="w-10 h-10 rounded-full border border-copper/40 text-copper-deep flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h4 className="font-display font-medium text-lg text-ink mb-1.5">
                        Office Address
                      </h4>
                      <p className="text-ink/60 text-sm leading-relaxed">
                        Flat No.203 US Residency, 5-9-30/1/17/17A Palace Colony,
                        <br />
                        Basheerbagh, Hyderabad - 500029
                      </p>
                    </div>
                  </div>

                  {/* Manufacturing unit */}
                  <a
                    href="https://maps.app.goo.gl/QKYvQZetU9kypmjh7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5"
                  >
                    <span className="w-10 h-10 rounded-full border border-copper/40 text-copper-deep flex items-center justify-center shrink-0 transition-colors group-hover:bg-copper group-hover:border-copper group-hover:text-ivory">
                      <FactoryIcon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h4 className="font-display font-medium text-lg text-ink mb-1.5 group-hover:text-copper-deep transition-colors">
                        Manufacturing Unit
                      </h4>
                      <p className="text-ink/60 text-sm leading-relaxed">
                        Survey No. 122/A, 123/A-A1/3,
                        <br />
                        Mothighanapur Village, Balangar Mandal,
                        <br />
                        Mahabubnagar Dist.
                      </p>
                      <p className="mt-2 text-[11px] font-mono tracking-[0.18em] uppercase text-copper-deep font-medium">
                        Open in Google Maps →
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <div className="flex items-center gap-5">
                    <span className="w-10 h-10 rounded-full border border-copper/40 text-copper-deep flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h4 className="font-display font-medium text-lg text-ink mb-0.5">
                        Email Us
                      </h4>
                      <a
                        href="mailto:varahametaliks@gmail.com"
                        className="text-copper-deep hover:text-ink font-medium text-sm transition-colors link-draw"
                      >
                        varahametaliks@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-5">
                    <span className="w-10 h-10 rounded-full border border-copper/40 text-copper-deep flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h4 className="font-display font-medium text-lg text-ink mb-1">
                        Call Us
                      </h4>
                      <div className="flex flex-col gap-1 text-ink/60 text-sm font-medium">
                        <a href="tel:+919849029993" className="hover:text-copper-deep transition-colors w-fit link-draw">
                          +91-9849029993
                        </a>
                        <a href="tel:+919248063222" className="hover:text-copper-deep transition-colors w-fit link-draw">
                          +91-9248063222
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="relative bg-paper/90 backdrop-blur-sm p-7 sm:p-11 rounded-2xl border border-ink/10 shadow-[0_50px_100px_-50px_rgba(7,26,47,0.5)]">
                  <div className="flex items-center gap-3 mb-9">
                    <DiamondMark size={6} />
                    <h3 className="font-display font-medium text-2xl text-ink">
                      Send an Inquiry
                    </h3>
                  </div>

                  {submitted ? (
                    <div className="flex items-center gap-3 p-5 rounded-xl bg-mineral/70 border border-copper/30 text-ink">
                      <CheckCircle2 className="w-5 h-5 text-copper-deep shrink-0" strokeWidth={1.6} />
                      <span className="text-sm font-medium">
                        Thank you! Your inquiry has been sent successfully.
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-7">
                      {error && (
                        <div className="p-4 rounded-xl border border-red-900/15 bg-red-50/60 text-red-900 text-sm font-medium">
                          {error}
                        </div>
                      )}

                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClass}
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                        <div>
                          <label htmlFor="email" className={labelClass}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputClass}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className={labelClass}>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={inputClass}
                            placeholder="+91 "
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className={labelClass}>
                          Your Inquiry
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={`${inputClass} resize-none`}
                          placeholder="Tell us about your requirements..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="group w-full bg-navy hover:bg-steelnavy text-ivory font-medium py-4 rounded-full transition-colors duration-500 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:pointer-events-none"
                      >
                        <span className="font-mono text-[11px] tracking-[0.24em] uppercase">
                          {submitting ? 'Sending…' : 'Send Message'}
                        </span>
                        <Send
                          className="w-4 h-4 text-champagne group-hover:text-ivory transition-colors"
                          strokeWidth={1.6}
                        />
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FactoryIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  );
}
