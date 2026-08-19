import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState, type ComponentProps, type FormEvent } from 'react';

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

  return (
    <section id="contact" className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Let's Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-12">
              Have an inquiry or need custom specifications? Reach out to us and our team will get back to you promptly.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Office Address</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Flat No.203 US Residency, 5-9-30/1/17/17A Palace Colony,<br />
                    Basheerbagh, Hyderabad - 500029
                  </p>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/QKYvQZetU9kypmjh7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start group"
              >
                <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-blue-200 transition-colors">
                  <FactoryIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">Manufacturing Unit</h4>
                  <p className="text-gray-600 leading-relaxed group-hover:text-blue-600 transition-colors">
                    Survey No. 122/A, 123/A-A1/3,<br />
                    Mothighanapur Village, Balangar Mandal,<br />
                    Mahabubnagar Dist.
                  </p>
                  <p className="mt-2 text-sm font-medium text-blue-600">Open in Google Maps →</p>
                </div>
              </a>

              <div className="flex items-center">
                <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Email Us</h4>
                  <a href="mailto:varahametaliks@gmail.com" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    varahametaliks@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-6 min-w-0">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Call Us</h4>
                  <div className="flex flex-col gap-1 text-gray-600 font-medium">
                    <a href="tel:+919849029993" className="whitespace-nowrap hover:text-blue-600 transition-colors">
                      +91-9849029993
                    </a>
                    <a href="tel:+919248063222" className="whitespace-nowrap hover:text-blue-600 transition-colors">
                      +91-9248063222
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Send an Inquiry</h3>
            {submitted ? (
               <div className="bg-green-50 text-green-800 p-6 rounded-2xl flex items-center border border-green-100">
                 <CheckCircle2 className="w-6 h-6 mr-3 shrink-0" />
                 <span className="font-medium">Thank you! Your inquiry has been sent successfully.</span>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm font-medium">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="+91 "
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Your Inquiry</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:from-blue-600 hover:to-blue-800 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <span>{submitting ? 'Sending…' : 'Send Message'}</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
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
