import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import factoryImage from '../assets/images/photo_6221737969593728038_y.jpg';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-vm-blue py-24 text-white sm:py-32 lg:py-40">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <div className="section-kicker section-kicker-light">10 / Contact</div>
            <h2 className="mt-8 max-w-2xl text-[clamp(3.4rem,8vw,8rem)] font-display font-bold uppercase leading-[0.8] tracking-[-0.09em]">Let&apos;s get<br /><span className="text-vm-gold">in touch.</span></h2>
            <div className="mt-12 overflow-hidden border border-white/15">
              <img src={factoryImage} alt="Varaha Metaliks factory" loading="lazy" className="aspect-[16/8] w-full object-cover opacity-85" />
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <ContactItem icon={<MapPin />} label="Office" text={<>Flat No.203 US Residency,<br />5-9-30/1/17/17A Palace Colony,<br />Basheerbagh, Hyderabad-500029</>} />
              <ContactItem icon={<MapPin />} label="Unit" text={<>Survey No. 122/A, 123/A-A1/3,<br />Mothighanapur Village,<br />Balangar Mandal, Mahabubnagar District.<br /><a href="https://maps.app.goo.gl/QKYvQZetU9kypmjh7" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-vm-gold hover:underline">Open in Google Maps →</a></>} />
              <ContactItem icon={<Mail />} label="Email" text={<a href="mailto:varahametaliks@gmail.com" className="break-all transition-colors hover:text-vm-gold">varahametaliks@gmail.com</a>} />
              <ContactItem icon={<Phone />} label="Phone" text={<><a href="tel:+919849029993" className="block hover:text-vm-gold">+91-9849029993</a><a href="tel:+919248063222" className="block hover:text-vm-gold">+91-9248063222</a></>} />
            </div>
          </div>

          <div className="lg:pt-16">
            <div className="border-t-2 border-vm-gold pt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">Send an inquiry</div>
              {submitted ? (
                <div className="mt-8 flex items-start gap-3 border border-vm-gold/50 bg-white/5 p-5 text-sm leading-6 text-white/80"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-vm-gold" />Thank you. Your inquiry has been sent successfully.</div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {error && <div className="border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">{error}</div>}
                  <Field id="name" label="Full name" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} required />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id="email" label="Email address" type="email" value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} required />
                    <Field id="phone" label="Phone number" value={formData.phone} onChange={(value) => setFormData({ ...formData, phone: value })} />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">Your inquiry</label>
                    <textarea id="message" required rows={5} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} className="w-full resize-none border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-vm-gold" placeholder="How can we help?" />
                  </div>
                  <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center gap-3 border border-vm-gold px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-vm-gold transition-colors hover:bg-vm-gold hover:text-vm-blue disabled:opacity-50"><span>{submitting ? 'Sending…' : 'Send inquiry'}</span><Send className="h-4 w-4" /></button>
                </form>
              )}
            </div>
            <div className="mt-16 border-t border-white/15 pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">BIS CERTIFIED ISO 9001 COMPANY<br /><span className="text-white/80">IS 9523:2000 · CM/L NO 6300089907</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, text }: { icon: React.ReactNode; label: string; text: React.ReactNode }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-vm-gold">{icon}</span><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</div><div className="mt-2 text-sm leading-6 text-white/75">{text}</div></div></div>;
}

function Field({ id, label, type = 'text', value, onChange, required = false }: { id: string; label: string; type?: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <div><label htmlFor={id} className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">{label}</label><input id={id} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-vm-gold" placeholder={label} /></div>;
}
