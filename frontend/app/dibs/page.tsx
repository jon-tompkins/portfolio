'use client';

import { useEffect, useMemo, useState } from 'react';

type Svc = { id: string; name: string; hint: string; color: string; tags: string[] };
const SERVICES: Svc[] = [
  { id: 'spotify', name: 'Spotify', hint: 'Artists you play', color: '#1db954', tags: ['music'] },
  { id: 'ticketmaster', name: 'Ticketmaster', hint: 'Shows you went to', color: '#026cdf', tags: ['music', 'sports', 'comedy'] },
  { id: 'opentable', name: 'OpenTable', hint: 'Where you eat', color: '#da3743', tags: ['food'] },
  { id: 'resy', name: 'Resy', hint: 'Tables you book', color: '#ff5a4f', tags: ['food', 'nightlife'] },
  { id: 'fandango', name: 'Fandango', hint: 'Movies you see', color: '#ff7300', tags: ['movies'] },
  { id: 'regal', name: 'Regal', hint: 'Your theater history', color: '#6e5bff', tags: ['movies'] },
];

const INTERESTS = [
  ['music', '🎵 Live music'], ['food', '🍽️ Restaurants'], ['movies', '🎬 Movies'], ['comedy', '🎤 Comedy'],
  ['sports', '🏟️ Sports'], ['nightlife', '🍸 Bars & nightlife'], ['art', '🎨 Art & museums'], ['outdoors', '🌲 Outdoors'],
] as const;
const WHEN = [['tonight', 'Tonight'], ['tomorrow', 'Tomorrow'], ['weekend', 'This weekend']] as const;
const BUDGET = [['$', 'Keep it cheap'], ['$$', 'Mid'], ['$$$', 'Treat myself']] as const;
const GROUP = [['1', 'Just me'], ['2', 'Two of us'], ['4', 'A group']] as const;

type Agg = { n: number; w: number; s: number; l: number; ln: number };
type Aspect = { key: string; sentiment: number; weight: number; lean: number | null };
const ASPECTS: Record<string, string> = {
  food: 'Food / the show itself', service: 'Service', noise: 'Noise level', crowd: 'Crowd', value: 'Value for money',
  vibe: 'Vibe & decor', pace: 'Pace & waits', access: 'Location & ease',
};
const LEAN_WORD: Record<string, [string, string]> = { noise: ['quiet', 'lively'], crowd: ['calm', 'packed'] };

type State = {
  step: number; connected: string[]; interests: string[]; when: string[]; budget: string; group: string;
  city: string; email: string; spotifyArtists: string[];
  taste: Record<string, Agg>; reviews: number;
};
const INIT: State = { step: 0, connected: [], interests: [], when: ['tonight', 'weekend'], budget: '$$', group: '2', city: '', email: '', spotifyArtists: [], taste: {}, reviews: 0 };

const PICKS: Record<string, { title: string; sub: string; deal: string; when: string }[]> = {
  music: [
    { title: 'Indie showcase, floor tickets', sub: 'Doors 8pm · venue 55% full', deal: '40% off', when: 'tonight' },
    { title: 'Jazz night, front row', sub: 'Saturday · 12 seats left', deal: '$15', when: 'weekend' },
  ],
  food: [
    { title: 'Chef’s counter, 2 seats', sub: '8:30pm · cancellation', deal: '30% off', when: 'tonight' },
    { title: 'Tasting menu, early seating', sub: 'Tomorrow 5:30pm · slow shift', deal: '25% off', when: 'tomorrow' },
  ],
  movies: [
    { title: 'Indie double feature', sub: 'Tomorrow 7pm · 14 seats left', deal: '2-for-1', when: 'tomorrow' },
    { title: 'Recliner screening, prime row', sub: 'Tonight 9:15pm', deal: '$8', when: 'tonight' },
  ],
  comedy: [{ title: 'Late show, front table', sub: 'Friday 10pm · 60% sold', deal: '50% off', when: 'weekend' }],
  sports: [{ title: 'Lower-bowl pair', sub: 'Tomorrow · resale dip', deal: '35% off', when: 'tomorrow' }],
  nightlife: [{ title: 'Rooftop bar, reserved booth', sub: 'Tonight · early crowd', deal: 'Free bottle', when: 'tonight' }],
  art: [{ title: 'After-hours museum entry', sub: 'Thursday 6pm', deal: '$10', when: 'tomorrow' }],
  outdoors: [{ title: 'Sunset kayak, 2 spots', sub: 'Saturday 5pm', deal: '30% off', when: 'weekend' }],
};

function Heat({ taste }: { taste: Record<string, Agg> }) {
  const rows = Object.entries(taste).sort((a, b) => b[1].w - a[1].w);
  return (
    <div className="heat">
      {rows.map(([k, t]) => {
        const hue = Math.round(((t.s + 1) / 2) * 120); // red -> green
        const care = t.w > 0.66 ? 'matters a lot' : t.w > 0.33 ? 'matters some' : 'doesn’t matter much';
        const lean = LEAN_WORD[k] && t.ln > 0 && Math.abs(t.l) > 0.25 ? ` · leans ${LEAN_WORD[k][t.l > 0 ? 1 : 0]}` : '';
        return (
          <div key={k} className="hrow">
            <span className="hl">{ASPECTS[k] || k}</span>
            <span className="hb"><i style={{ width: `${Math.max(8, t.w * 100)}%`, background: `hsl(${hue} 70% 48%)` }} /></span>
            <small>{care}{lean}</small>
          </div>
        );
      })}
    </div>
  );
}

export default function Dibs() {
  const [s, setS] = useState<State>(INIT);
  const [busy, setBusy] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [spotifyLive, setSpotifyLive] = useState(false);
  const [note, setNote] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [place, setPlace] = useState('');
  const [said, setSaid] = useState('');
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<{ summary: string; aspects: Aspect[] } | null>(null);
  const [err, setErr] = useState('');
  const [rec, setRec] = useState<any>(null);

  useEffect(() => {
    try { const raw = localStorage.getItem('dibs-v1'); if (raw) setS({ ...INIT, ...JSON.parse(raw) }); } catch {}
    // Returning from Spotify's full-page redirect: fold the result into saved progress.
    const m = document.cookie.match(/(?:^|; )dibs_spotify=([^;]+)/);
    const result = new URLSearchParams(location.search).get('spotify');
    if (m) {
      try {
        const d = JSON.parse(decodeURIComponent(decodeURIComponent(m[1])));
        setS((o) => ({
          ...o, step: Math.max(o.step, 1),
          connected: Array.from(new Set([...o.connected, 'spotify'])),
          interests: Array.from(new Set([...o.interests, ...(d.tags || [])])),
          spotifyArtists: d.artists || [],
        }));
      } catch {}
      document.cookie = 'dibs_spotify=; Max-Age=0; path=/dibs';
    } else if (result && result !== 'ok') {
      setNote(result === 'unavailable' ? 'Spotify isn’t switched on yet.' : 'Spotify didn’t connect. You can try again or skip.');
    }
    if (result) history.replaceState(null, '', '/dibs');
    fetch('/api/dibs/config').then((r) => r.json()).then((c) => setSpotifyLive(!!c.spotify)).catch(() => {});
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('dibs-v1', JSON.stringify(s)); }, [s, ready]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [s.step]);

  const set = (p: Partial<State>) => setS((o) => ({ ...o, ...p }));
  const toggle = (k: 'connected' | 'interests' | 'when', v: string) =>
    setS((o) => ({ ...o, [k]: o[k].includes(v) ? o[k].filter((x) => x !== v) : [...o[k], v] }));

  const connect = (id: string) => {
    if (s.connected.includes(id)) return toggle('connected', id);
    if (id === 'spotify' && spotifyLive) { setBusy(id); window.location.href = '/api/dibs/spotify/login'; return; }
    setBusy(id);
    setTimeout(() => {
      setS((o) => {
        const svc = SERVICES.find((x) => x.id === id)!;
        return { ...o, connected: [...o.connected, id], interests: Array.from(new Set([...o.interests, ...svc.tags])) };
      });
      setBusy(null);
    }, 900);
  };

  const startMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setErr('Dictation isn’t supported in this browser. Tap the text box and use your keyboard’s mic.'); return; }
    const r = new SR(); r.continuous = true; r.interimResults = false; r.lang = 'en-US';
    r.onresult = (e: any) => {
      const t = Array.from(e.results).slice(e.resultIndex).map((x: any) => x[0].transcript).join(' ');
      setSaid((o) => (o ? o + ' ' : '') + t.trim());
    };
    r.onerror = () => { setListening(false); setErr('Couldn’t hear that. Check mic permission, or just type.'); };
    r.onend = () => setListening(false);
    r.start(); setRec(r); setListening(true); setErr('');
  };
  const stopMic = () => { rec?.stop(); setListening(false); };
  const sendReview = async () => {
    stopMic(); setThinking(true); setErr('');
    try {
      const res = await fetch('https://www.myjunto.xyz/api/public/dibs-review', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: said, place, email: s.email }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'failed');
      setResult(d);
      setS((o) => {
        const taste = { ...o.taste };
        for (const a of d.aspects as Aspect[]) {
          const t = taste[a.key] || { n: 0, w: 0, s: 0, l: 0, ln: 0 };
          const n = t.n + 1;
          taste[a.key] = {
            n, w: (t.w * t.n + a.weight) / n, s: (t.s * t.n + a.sentiment) / n,
            l: a.lean == null ? t.l : (t.l * t.ln + a.lean) / (t.ln + 1), ln: t.ln + (a.lean == null ? 0 : 1),
          };
        }
        return { ...o, taste, reviews: o.reviews + 1 };
      });
    } catch { setErr('That didn’t go through. Try again in a moment.'); }
    setThinking(false);
  };
  const closeReview = () => { setReviewing(false); setResult(null); setSaid(''); setPlace(''); setErr(''); };

  const steps = ['Connect', 'Tastes', 'Details', 'Picks'];
  const picks = useMemo(() => {
    const out = s.interests.flatMap((i) => (PICKS[i] || []).map((p) => ({ ...p, key: i + p.title, match: i })));
    out.sort((a, b) => Number(s.when.includes(b.when)) - Number(s.when.includes(a.when)));
    return out.slice(0, 5);
  }, [s.interests, s.when]);

  if (!ready) return null;
  const next = () => set({ step: s.step + 1 });
  const submit = () => {
    fetch('https://www.myjunto.xyz/api/public/dibs-signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s),
    }).catch(() => {});
    next();
  };
  const back = () => set({ step: Math.max(0, s.step - 1) });

  return (
    <main className="dibs">
      <style>{CSS}</style>
      <div className="wrap">
        <div className="top">
          <div className="logo">dibs<span>.</span></div>
          {s.step > 0 && <button className="link" onClick={() => { setS(INIT); setClaimed([]); }}>Start over</button>}
        </div>
        <div className="bar">{steps.map((n, i) => <i key={n} className={i <= s.step ? 'on' : ''} />)}</div>
        <div className="stepname">{steps[s.step]}</div>

        {!reviewing && s.step === 0 && (<section>
          <h1>Connect what you love.</h1>
          <p className="lead">The more you link, the less you have to tell us. Tap any that apply. Read-only, and nothing is posted.</p>
          <div className="svcs">
            {SERVICES.map((v) => {
              const on = s.connected.includes(v.id);
              return (
                <button key={v.id} className={'svc' + (on ? ' on' : '')} onClick={() => connect(v.id)} disabled={busy === v.id}>
                  <span className="dot" style={{ background: v.color }}>{v.name[0]}</span>
                  <span className="txt"><b>{v.name}</b><small>{busy === v.id ? 'Connecting…' : on ? 'Connected' : v.hint}</small></span>
                  <span className="chk">{on ? '✓' : '+'}</span>
                </button>
              );
            })}
          </div>
          {note && <p className="fine" style={{ color: 'var(--acc)' }}>{note}</p>}
          <p className="fine">{spotifyLive ? 'Spotify is real (read-only top artists). The others are simulated until launch.' : 'Preview: connections are simulated until launch. Nothing leaves your browser.'}</p>
          <div className="cta-row">
            <button className="btn" onClick={next}>{s.connected.length ? `Continue with ${s.connected.length}` : 'Continue'}</button>
            {!s.connected.length && <button className="link" onClick={next}>Skip, I’ll just tell you</button>}
          </div>
        </section>)}

        {!reviewing && s.step === 1 && (<section>
          <h1>What should we tap you for?</h1>
          <p className="lead">{s.connected.length ? 'We pre-picked from your accounts. Adjust freely.' : 'Pick as many as you like.'}</p>
          <div className="chips">{INTERESTS.map(([k, l]) => <button key={k} className={'chip' + (s.interests.includes(k) ? ' on' : '')} onClick={() => toggle('interests', k)}>{l}</button>)}</div>
          <div className="q">When are you free?</div>
          <div className="chips">{WHEN.map(([k, l]) => <button key={k} className={'chip' + (s.when.includes(k) ? ' on' : '')} onClick={() => toggle('when', k)}>{l}</button>)}</div>
          <div className="cta-row"><button className="btn" disabled={!s.interests.length} onClick={next}>Next</button><button className="link" onClick={back}>Back</button></div>
        </section>)}

        {!reviewing && s.step === 2 && (<section>
          <h1>Last two things.</h1>
          <div className="q">Typical budget</div>
          <div className="chips">{BUDGET.map(([k, l]) => <button key={k} className={'chip' + (s.budget === k ? ' on' : '')} onClick={() => set({ budget: k })}>{k} · {l}</button>)}</div>
          <div className="q">Usually going with</div>
          <div className="chips">{GROUP.map(([k, l]) => <button key={k} className={'chip' + (s.group === k ? ' on' : '')} onClick={() => set({ group: k })}>{l}</button>)}</div>
          <div className="q">Where are you?</div>
          <input className="in" placeholder="City or zip" autoComplete="postal-code" enterKeyHint="next" value={s.city} onChange={(e) => set({ city: e.target.value })} />
          <div className="q">Where should we send picks?</div>
          <input className="in" type="email" inputMode="email" autoComplete="email" enterKeyHint="go" placeholder="you@email.com" value={s.email} onChange={(e) => set({ email: e.target.value })} />
          <p className="fine">1–3 picks a day, only when something fits. Unsubscribe anytime.</p>
          <div className="cta-row"><button className="btn" disabled={!s.city || !/.+@.+\..+/.test(s.email)} onClick={submit}>Show my picks</button><button className="link" onClick={back}>Back</button></div>
        </section>)}

        {reviewing && (<section>
          <h1>{result ? 'Got it.' : 'How was it?'}</h1>
          {!result ? (<>
            <p className="lead">Just talk. Loud, quiet, rude waiter, great pasta: whatever you’d tell a friend. No stars.</p>
            <input className="in" placeholder="Where was it? (optional)" value={place} onChange={(e) => setPlace(e.target.value)} />
            <div className="micwrap">
              <button className={'mic' + (listening ? ' live' : '')} onClick={listening ? stopMic : startMic} aria-label={listening ? 'Stop' : 'Start dictating'}>{listening ? '■' : '🎙️'}</button>
              <small>{listening ? 'Listening… tap to stop' : said ? 'Tap to add more' : 'Tap and talk'}</small>
            </div>
            <textarea className="in ta" placeholder="…or type it here" value={said} onChange={(e) => setSaid(e.target.value)} rows={5} />
            {err && <p className="fine" style={{ color: 'var(--acc2)' }}>{err}</p>}
            <div className="cta-row">
              <button className="btn" disabled={said.trim().length < 8 || thinking} onClick={sendReview}>{thinking ? 'Reading between the lines…' : 'Done'}</button>
              <button className="link" onClick={closeReview}>Cancel</button>
            </div>
          </>) : (<>
            <p className="lead">{result.summary}</p>
            <Heat taste={Object.fromEntries(result.aspects.map((a) => [a.key, { n: 1, w: a.weight, s: a.sentiment, l: a.lean ?? 0, ln: a.lean == null ? 0 : 1 }]))} />
            <p className="fine">Added to your taste profile. Your picks will lean on this.</p>
            <div className="cta-row"><button className="btn" onClick={closeReview}>Back to picks</button></div>
          </>)}
        </section>)}

        {!reviewing && s.step === 3 && (<section>
          <h1>You’re in. Here’s what fits.</h1>
          <p className="lead">{s.city ? `Near ${s.city}. ` : ''}Sample picks from your tastes. Live inventory starts at launch, and we’ll email {s.email || 'you'} first.</p>
          {picks.map((p) => (
            <div key={p.key} className="deal">
              <div><b>{p.title}</b><small>{p.sub}</small><em>Because you like {INTERESTS.find(([k]) => k === p.match)?.[1].replace(/^\S+\s/, '').toLowerCase()}</em></div>
              <div className="right"><span className="tag">{p.deal}</span>
                <button className={'claim' + (claimed.includes(p.key) ? ' done' : '')} onClick={() => setClaimed((c) => c.includes(p.key) ? c : [...c, p.key])}>{claimed.includes(p.key) ? 'Dibs ✓' : 'Call dibs'}</button></div>
            </div>
          ))}
          {Object.keys(s.taste).length > 0 && (<div className="card2"><b>Your taste</b><Heat taste={s.taste} /><small>{s.reviews} {s.reviews === 1 ? 'review' : 'reviews'} so far</small></div>)}
          <div className="card2 tap" onClick={() => setReviewing(true)} role="button"><b>🎙️ Been out lately?</b><small>Tell us how it went in your own words. It sharpens your picks.</small></div>
          <div className="cta-row"><button className="link" onClick={back}>Edit tastes</button></div>
        </section>)}
      </div>
    </main>
  );
}

const CSS = `
.dibs{--bg:#0f0e17;--card:#1a1930;--mute:#a7a9be;--acc:#ff8906;--acc2:#e53170;background:var(--bg);color:#fffffe;min-height:100vh;font-size:17px;line-height:1.5}
.dibs *{box-sizing:border-box}.dibs button{font:inherit;color:inherit;cursor:pointer}
.dibs{min-height:100dvh;-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:100%}
.wrap{max-width:560px;margin:0 auto;padding:max(16px,env(safe-area-inset-top)) 18px calc(130px + env(safe-area-inset-bottom))}
.top{display:flex;justify-content:space-between;align-items:center;padding:6px 0 18px}
.logo{font-weight:800;font-size:22px;letter-spacing:-.5px}.logo span{color:var(--acc)}
.bar{display:flex;gap:6px}.bar i{flex:1;height:4px;border-radius:4px;background:#2c2b47;transition:.3s}.bar i.on{background:linear-gradient(90deg,var(--acc),var(--acc2))}
.stepname{color:var(--mute);font-size:13px;margin:8px 0 22px;text-transform:uppercase;letter-spacing:1px}
h1{font-size:clamp(28px,8.5vw,40px);line-height:1.08;letter-spacing:-1px;margin:0 0 10px}
.lead{color:var(--mute);margin:0 0 22px}.fine{color:var(--mute);font-size:13px;margin:14px 0}
.svcs{display:grid;gap:10px}
.svc{display:flex;align-items:center;gap:14px;min-height:68px;width:100%;background:var(--card);border:1.5px solid transparent;border-radius:14px;padding:14px 16px;text-align:left;transition:.15s}
.svc:active{transform:scale(.98)}.svc.on{border-color:var(--acc);background:#241f2f}
.dot{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;font-weight:800;color:#fff;flex:none}
.txt{flex:1;display:flex;flex-direction:column}.txt small{color:var(--mute);font-size:14px}
.chk{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#2c2b47;font-weight:700}.svc.on .chk{background:var(--acc);color:#111}
.chips{display:flex;flex-wrap:wrap;gap:10px}
.chip{background:var(--card);border:1.5px solid transparent;border-radius:99px;min-height:46px;padding:10px 18px;transition:.15s}.chip:active{transform:scale(.96)}.chip.on{border-color:var(--acc);background:#2a2230}
.q{margin:26px 0 10px;font-weight:700}
.in{width:100%;min-height:52px;background:var(--card);border:1.5px solid #2c2b47;border-radius:12px;padding:14px;color:#fff;font:inherit;font-size:16px;outline:none;-webkit-appearance:none}.in:focus{border-color:var(--acc)}
.cta-row{position:fixed;left:0;right:0;bottom:0;z-index:10;display:flex;flex-direction:column;align-items:center;gap:10px;padding:28px 18px calc(14px + env(safe-area-inset-bottom));background:linear-gradient(to top,var(--bg) 70%,transparent)}
.cta-row>*{width:100%;max-width:524px}
.btn{background:var(--acc);color:#111;border:0;border-radius:14px;min-height:54px;padding:15px 28px;font-weight:700;font-size:17px;transition:.15s}.btn:active{transform:scale(.98)}.btn:disabled{opacity:.35;cursor:not-allowed}
.link{background:none;border:0;color:var(--mute);text-decoration:underline;padding:8px;min-height:40px}
.deal{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;background:var(--card);border-radius:14px;padding:16px 18px;margin:12px 0}
.deal b{display:block}.deal small{display:block;color:var(--mute);font-size:14px}.deal em{display:block;color:var(--acc);font-size:13px;font-style:normal;margin-top:6px}
.right{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex:none}
.tag{background:var(--acc2);border-radius:99px;padding:3px 12px;font-weight:700;font-size:14px}
.claim{background:transparent;border:1.5px solid var(--acc);color:var(--acc);border-radius:10px;min-height:42px;padding:8px 16px;font-weight:600}.claim.done{background:var(--acc);color:#111}

.card2{background:var(--card);border-radius:14px;padding:16px 18px;margin:16px 0}.card2 b{display:block}.card2 small{display:block;color:var(--mute);font-size:14px;margin-top:4px}
.card2.tap{border:1.5px dashed #3a3960;cursor:pointer}.card2.tap:active{transform:scale(.98)}
.micwrap{display:flex;flex-direction:column;align-items:center;gap:8px;margin:26px 0}.micwrap small{color:var(--mute)}
.mic{width:96px;height:96px;border-radius:50%;border:0;background:var(--acc);font-size:36px;color:#111;transition:.2s}.mic.live{background:var(--acc2);color:#fff;animation:pulse 1.2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(229,49,112,.5)}100%{box-shadow:0 0 0 24px rgba(229,49,112,0)}}
.ta{min-height:120px;resize:vertical;margin-top:4px}
.heat{display:grid;gap:12px;margin:14px 0 6px}.hrow{display:grid;gap:4px}.hl{font-size:15px;font-weight:600}
.hb{height:10px;border-radius:6px;background:#2c2b47;overflow:hidden;display:block}.hb i{display:block;height:100%;border-radius:6px;transition:width .5s}
.hrow small{margin:0;color:var(--mute);font-size:13px}
`;
