import { FormEvent, useState } from 'react';
import { ArrowRight, Check, Mail, UtensilsCrossed } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function App() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');
    setErrorMessage('');

    const { error } = await supabase.from('waitlist_signups').insert({
      first_name: firstName.trim() || null,
      email: email.trim().toLowerCase(),
    });

    if (error) {
      setSubmitState('error');
      setErrorMessage(
        error.code === '23505'
          ? "You're already on the list. We'll be in touch soon."
          : 'Something went wrong. Please try again.'
      );
      return;
    }

    const whatsappMessage = [
      'New waitlist signup for The Cuisine\'s',
      `Name: ${firstName.trim() || 'Not provided'}`,
      `Email: ${email.trim().toLowerCase()}`,
    ].join('\\n');
    setWhatsappLink(`https://wa.me/919692607798?text=${encodeURIComponent(whatsappMessage)}`);
    setSubmitState('success');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-espresso text-cream">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="glow glow-top pointer-events-none absolute" />
      <div className="glow glow-bottom pointer-events-none absolute" />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
        <a className="brand-mark" href="#top" aria-label="The Cuisine's home">
          <span className="brand-script">The</span>
          <span className="brand-name">CUISINE'S</span>
        </a>
        <span className="nav-note">Coming soon</span>
      </nav>

      <section id="top" className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] w-full max-w-7xl items-center gap-14 px-6 pb-16 pt-8 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-24 lg:px-16 lg:pb-24 lg:pt-4">
        <div className="max-w-2xl">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            A new table is being set
          </div>
          <h1>Good food.<br /><em>Great stories.</em><br />Coming soon.</h1>
          <p className="hero-copy">
            An intimate destination for the curious and hungry. Join the first pour and be the first to know when The Cuisine&apos;s opens its doors.
          </p>

          <div className="pill-row" aria-label="What to expect">
            <span><UtensilsCrossed size={15} strokeWidth={1.5} /> Thoughtful plates</span>
            <span><span className="pill-dot" /> Unhurried moments</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
          <div className="form-card">
            {submitState === 'success' ? (
              <div className="success-state">
                <div className="success-icon"><Check size={27} strokeWidth={1.5} /></div>
                <p className="card-kicker">You&apos;re on the list</p>
                <h2>We&apos;ll save you a seat.</h2>
                <p>Keep an eye on your inbox. An invitation to the table will be arriving soon.</p>
                <a className="whatsapp-button" href={whatsappLink} target="_blank" rel="noreferrer">Send details on WhatsApp <ArrowRight size={15} /></a>
                <button className="text-button" onClick={() => { setSubmitState('idle'); setFirstName(''); setEmail(''); setWhatsappLink(''); }}>Join with another email <ArrowRight size={15} /></button>
              </div>
            ) : (
              <>
                <div className="card-icon"><Mail size={19} strokeWidth={1.5} /></div>
                <p className="card-kicker">The guest list</p>
                <h2>Pull up a chair.</h2>
                <p className="card-description">Sign up for first access, opening news, and a few delicious surprises along the way.</p>
                <form onSubmit={handleSubmit} className="waitlist-form">
                  <label>
                    <span>Your name <small>Optional</small></span>
                    <input value={firstName} onChange={(event) => setFirstName(event.target.value)} maxLength={80} placeholder="First name" autoComplete="given-name" />
                  </label>
                  <label>
                    <span>Email address</span>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="you@example.com" autoComplete="email" />
                  </label>
                  <button className="submit-button" disabled={submitState === 'submitting'} type="submit">
                    {submitState === 'submitting' ? 'Saving your seat...' : <>Join the waitlist <ArrowRight size={17} /></>}
                  </button>
                  {submitState === 'error' && <p className="form-error" role="alert">{errorMessage}</p>}
                </form>
                <p className="privacy-note">No noise, just good news. Unsubscribe anytime.</p>
              </>
            )}
          </div>
          <div className="card-caption">Est. 2026 <span /> Made for the memorable</div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-t border-cream/15 px-6 py-6 text-xs tracking-[0.15em] text-cream/45 sm:px-10 lg:px-16">
        <span>THE CUISINE&apos;S</span>
        <span>Eat well · Live fully</span>
      </footer>
    </main>
  );
}

export default App;
