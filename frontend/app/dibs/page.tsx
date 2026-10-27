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

type State = {
  step: number; connected: string[]; interests: string[]; when: string[]; budget: string; group: string;
  city: string; email: string;
};
const INIT: State = { step: 0, connected: [], interests: [], when: ['tonight', 'weekend'], budget: '$$', group: '2', city: '', email: '' };

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

export default function Dibs() {
  const [s, setS] = useState<State>(INIT);
  const [busy, setBusy] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [claimed, setClaimed] = useState<string[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem('dibs-v1'); if (raw) setS({ ...INIT, ...JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('dibs-v1', JSON.stringify(s)); }, [s, ready]);

  const set = (p: Partial<State>) => setS((o) => ({ ...o, ...p }));
  const toggle = (k: 'connected' | 'interests' | 'when', v: string) =>
    setS((o) => ({ ...o, [k]: o[k].includes(v) ? o[k].filter((x) => x !== v) : [...o[k], v] }));

  const connect = (id: string) => {
    if (s.connected.includes(id)) return toggle('connected', id);
    setBusy(id);
    setTimeout(() => {
      setS((o) => {
        const svc = SERVICES.find((x) => x.id === id)!;
        return { ...o, connected: [...o.connected, id], interests: Array.from(new Set([...o.interests, ...svc.tags])) };
      });
      setBusy(null);
    }, 900);
  };

  const steps = ['Connect', 'Tastes', 'Details', 'Picks'];
  const picks = useMemo(() => {
    const out = s.interests.flatMap((i) => (PICKS[i] || []).map((p) => ({ ...p, key: i + p.title, match: i })));
    out.sort((a, b) => Number(s.when.includes(b.when)) - Number(s.when.includes(a.when)));
    return out.slice(0, 5);
  }, [s.interests, s.when]);

  if (!ready) return null;
  const next = () => set({ step: s.step + 1 });
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

        {s.step === 0 && (<section>
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
          <p className="fine">Preview: connections are simulated until launch. Nothing leaves your browser.</p>
          <div className="cta-row">
            <button className="btn" onClick={next}>{s.connected.length ? `Continue with ${s.connected.length}` : 'Continue'}</button>
            {!s.connected.length && <button className="link" onClick={next}>Skip, I’ll just tell you</button>}
          </div>
        </section>)}

        {s.step === 1 && (<section>
          <h1>What should we tap you for?</h1>
          <p className="lead">{s.connected.length ? 'We pre-picked from your accounts. Adjust freely.' : 'Pick as many as you like.'}</p>
          <div className="chips">{INTERESTS.map(([k, l]) => <button key={k} className={'chip' + (s.interests.includes(k) ? ' on' : '')} onClick={() => toggle('interests', k)}>{l}</button>)}</div>
          <div className="q">When are you free?</div>
          <div className="chips">{WHEN.map(([k, l]) => <button key={k} className={'chip' + (s.when.includes(k) ? ' on' : '')} onClick={() => toggle('when', k)}>{l}</button>)}</div>
          <div className="cta-row"><button className="btn" disabled={!s.interests.length} onClick={next}>Next</button><button className="link" onClick={back}>Back</button></div>
        </section>)}

        {s.step === 2 && (<section>
          <h1>Last two things.</h1>
          <div className="q">Typical budget</div>
          <div className="chips">{BUDGET.map(([k, l]) => <button key={k} className={'chip' + (s.budget === k ? ' on' : '')} onClick={() => set({ budget: k })}>{k} · {l}</button>)}</div>
          <div className="q">Usually going with</div>
          <div className="chips">{GROUP.map(([k, l]) => <button key={k} className={'chip' + (s.group === k ? ' on' : '')} onClick={() => set({ group: k })}>{l}</button>)}</div>
          <div className="q">Where are you?</div>
          <input className="in" placeholder="City or zip" value={s.city} onChange={(e) => set({ city: e.target.value })} />
          <div className="q">Where should we send picks?</div>
          <input className="in" type="email" placeholder="you@email.com" value={s.email} onChange={(e) => set({ email: e.target.value })} />
          <p className="fine">1–3 picks a day, only when something fits. Unsubscribe anytime.</p>
          <div className="cta-row"><button className="btn" disabled={!s.city || !/.+@.+\..+/.test(s.email)} onClick={next}>Show my picks</button><button className="link" onClick={back}>Back</button></div>
        </section>)}

        {s.step === 3 && (<section>
          <h1>You’re in. Here’s what fits.</h1>
          <p className="lead">{s.city ? `Near ${s.city}. ` : ''}Sample picks from your tastes. Live inventory starts at launch, and we’ll email {s.email || 'you'} first.</p>
          {picks.map((p) => (
            <div key={p.key} className="deal">
              <div><b>{p.title}</b><small>{p.sub}</small><em>Because you like {INTERESTS.find(([k]) => k === p.match)?.[1].replace(/^\S+\s/, '').toLowerCase()}</em></div>
              <div className="right"><span className="tag">{p.deal}</span>
                <button className={'claim' + (claimed.includes(p.key) ? ' done' : '')} onClick={() => setClaimed((c) => c.includes(p.key) ? c : [...c, p.key])}>{claimed.includes(p.key) ? 'Dibs ✓' : 'Call dibs'}</button></div>
            </div>
          ))}
          <div className="cta-row"><button className="link" onClick={back}>Edit tastes</button></div>
        </section>)}
      </div>
    </main>
  );
}

const CSS = `
.dibs{--bg:#0f0e17;--card:#1a1930;--mute:#a7a9be;--acc:#ff8906;--acc2:#e53170;background:var(--bg);color:#fffffe;min-height:100vh;font-size:17px;line-height:1.5}
.dibs *{box-sizing:border-box}.dibs button{font:inherit;color:inherit;cursor:pointer}
.wrap{max-width:560px;margin:0 auto;padding:20px 20px 80px}
.top{display:flex;justify-content:space-between;align-items:center;padding:6px 0 18px}
.logo{font-weight:800;font-size:22px;letter-spacing:-.5px}.logo span{color:var(--acc)}
.bar{display:flex;gap:6px}.bar i{flex:1;height:4px;border-radius:4px;background:#2c2b47;transition:.3s}.bar i.on{background:linear-gradient(90deg,var(--acc),var(--acc2))}
.stepname{color:var(--mute);font-size:13px;margin:8px 0 22px;text-transform:uppercase;letter-spacing:1px}
h1{font-size:clamp(30px,8vw,40px);line-height:1.08;letter-spacing:-1px;margin:0 0 10px}
.lead{color:var(--mute);margin:0 0 22px}.fine{color:var(--mute);font-size:13px;margin:14px 0}
.svcs{display:grid;gap:10px}
.svc{display:flex;align-items:center;gap:14px;background:var(--card);border:1.5px solid transparent;border-radius:14px;padding:14px 16px;text-align:left;transition:.15s}
.svc:hover{border-color:#3a3960}.svc.on{border-color:var(--acc);background:#241f2f}
.dot{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;font-weight:800;color:#fff;flex:none}
.txt{flex:1;display:flex;flex-direction:column}.txt small{color:var(--mute);font-size:14px}
.chk{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#2c2b47;font-weight:700}.svc.on .chk{background:var(--acc);color:#111}
.chips{display:flex;flex-wrap:wrap;gap:10px}
.chip{background:var(--card);border:1.5px solid transparent;border-radius:99px;padding:10px 16px;transition:.15s}.chip:hover{border-color:#3a3960}.chip.on{border-color:var(--acc);background:#2a2230}
.q{margin:26px 0 10px;font-weight:700}
.in{width:100%;background:var(--card);border:1.5px solid #2c2b47;border-radius:12px;padding:14px;color:#fff;font:inherit;outline:none}.in:focus{border-color:var(--acc)}
.cta-row{display:flex;align-items:center;gap:18px;margin-top:30px}
.btn{background:var(--acc);color:#111;border:0;border-radius:12px;padding:15px 28px;font-weight:700;transition:.15s}.btn:disabled{opacity:.35;cursor:not-allowed}
.link{background:none;border:0;color:var(--mute);text-decoration:underline;padding:0}
.deal{display:flex;justify-content:space-between;gap:12px;background:var(--card);border-radius:14px;padding:16px 18px;margin:12px 0}
.deal b{display:block}.deal small{display:block;color:var(--mute);font-size:14px}.deal em{display:block;color:var(--acc);font-size:13px;font-style:normal;margin-top:6px}
.right{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex:none}
.tag{background:var(--acc2);border-radius:99px;padding:3px 12px;font-weight:700;font-size:14px}
.claim{background:transparent;border:1.5px solid var(--acc);color:var(--acc);border-radius:10px;padding:6px 14px;font-weight:600}.claim.done{background:var(--acc);color:#111}
`;
