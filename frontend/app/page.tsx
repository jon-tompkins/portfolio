import Image from 'next/image';
import { ArrowUpRight, Zap, Bot, BarChart3, Globe, Shield, Eye, Code2, Workflow, Boxes, TrendingUp } from 'lucide-react';

const projects = [
  {
    name: 'MyJunto',
    tagline: 'The signal, not the noise',
    description: 'Build curated intelligence dispatches from the voices you actually trust — Twitter, newsletters, YouTube — synthesized by AI into starts worth reading.',
    tech: ['Next.js', 'Vercel', 'AI synthesis'],
    icon: Workflow,
    status: 'public beta',
    url: 'https://myjunto.xyz',
    preview: '/preview-myjunto.png',
    highlights: ['Community-first design', 'AI-curated content from trusted sources', 'Live and serving users'],
  },
  {
    name: 'Ailmanack',
    tagline: 'Personal hedge fund, AI-powered',
    description: 'AI equity research platform running a multi-agent investment process. Specialized agents handle research, analysis, and synthesis — culminating in actionable trade ideas.',
    tech: ['Python', 'Multi-agent', 'Claude', 'Equity research'],
    icon: TrendingUp,
    status: 'in progress',
    url: 'https://ailmanack.com',
    preview: '/preview-ailmanack.png',
    highlights: ['Jeb, Ant, and Pete agents handle distinct research roles', 'Haiku synthesis layer consolidates findings', 'Buffett-style value investing framework'],
  },
  {
    name: 'Aegis',
    tagline: 'The chain that fights back',
    description: 'An Ethereum L2 where AI validators screen every transaction. Anomalies get paused. Exploits get stopped — before the pool drains.',
    tech: ['Ethereum L2', 'AI validators', 'Solidity'],
    icon: Shield,
    status: 'in progress',
    url: 'https://aegischain.xyz',
    preview: '/preview-aegis.png',
    highlights: ['AI screens every transaction before finality', 'Anomaly detection pauses suspicious activity', 'Exploit prevention at the protocol layer'],
  },
  {
    name: 'Quillt',
    tagline: 'Own your ad space. Set your price.',
    description: 'Ad marketplace where publishers set their price and own their slots forever. No auctions, no intermediaries taking 45%, no uncertainty.',
    tech: ['Next.js', 'NextAuth', 'Vercel', 'Harberger pricing'],
    icon: Globe,
    status: 'paused',
    url: 'https://quillt.xyz',
    preview: '/preview-quillt.png',
    highlights: ['Publisher sets price, keeps 90% on every sale', 'Advertiser chooses duration, pays 10% APR holding cost', 'Auto-renew, buyout protection, slot returns on expiry'],
  },
  {
    name: 'Clawstreet',
    tagline: 'The home of agentic competition',
    description: 'AI agents compete for real stakes. Verifiable track records. Provable skill. Features trading competitions and on-chain RPS with commit-reveal fairness.',
    tech: ['Next.js', 'Python', 'Solidity', 'Multi-agent'],
    icon: BarChart3,
    status: 'paused',
    url: 'https://clawstreet.club',
    preview: '/preview-clawstreet.png',
    highlights: ['AI agents battle for alpha with commit-reveal fair play', 'Rock Paper Scissors with real stakes, 1% rake', '9 agents, 129 trades, 50 games played'],
  },
];

const experimental = [
  {
    name: 'Wolf',
    tagline: 'Autonomous trading agent',
    description: 'An AI agent that independently analyzes markets, generates trade ideas, executes paper trades, and learns from results on a daily schedule.',
    tech: ['Python', 'Cron', 'Telegram API', 'xAI'],
    icon: Bot,
    highlights: ['$1M paper balance, autonomous decisions', 'Daily digest + learning loop', 'Tracks every action with notes for review'],
  },
  {
    name: 'Glyph',
    tagline: 'Visual memory system for AI agents',
    description: 'A compact visual language for encoding state, context, and meaning across AI agents. Compresses complex information ~6:1 versus text.',
    tech: ['Emoji grammar', 'Multi-agent', 'Token optimization'],
    icon: Eye,
    highlights: ['2.4x faster agent coordination vs text', '55% lower token costs in A/B tests', 'Temporal glyphs track direction, velocity, timeframe'],
  },
  {
    name: 'Commit-Reveal',
    tagline: 'Fair on-chain randomization',
    description: 'A commit-reveal scheme for fair, transparent on-chain randomization. Designed for games requiring verifiable randomness.',
    tech: ['Solidity', 'Smart Contracts'],
    icon: Shield,
    highlights: ['Verifiable on-chain randomness', 'Fair game mechanics'],
  },
  {
    name: 'RPS',
    tagline: 'On-chain Rock Paper Scissors',
    description: 'Rock Paper Scissors with commit-reveal fairness, built as a proof of concept for trustless on-chain games.',
    tech: ['Solidity', 'Web3'],
    icon: Boxes,
    highlights: ['Commit-reveal for fair gameplay', 'Trustless on-chain execution'],
  },
];

const stateboard = [
  { name: 'MyJunto', stage: 'public beta', health: '🟢', feeling: '✨', notes: 'Live, serving users, AI-curated dispatches' },
  { name: 'Ailmanack', stage: 'building', health: '🟡', feeling: '🏗️', notes: 'Multi-agent equity research in development' },
  { name: 'Aegis', stage: 'in progress', health: '🟡', feeling: '🛠️', notes: 'Pre-alpha, specs published' },
  { name: 'Quillt', stage: 'paused', health: '🟡', feeling: '⏸️', notes: 'Publisher + advertiser flows built' },
  { name: 'Clawstreet', stage: 'paused', health: '🟡', feeling: '⏸️', notes: '9 agents, 129 trades, 50 RPS games' },
  { name: 'Wolf', stage: 'experimental', health: '🟢', feeling: '💪', notes: 'Autonomous daily trading loop running' },
  { name: 'Glyph', stage: 'experimental', health: '🟢', feeling: '🤔', notes: '6:1 compression, A/B tested' },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'public beta': 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    live: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    'in progress': 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    building: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    paused: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
    experimental: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    prototype: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    built: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colors[status] || colors.built}`}>
      {status}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-zinc-100">Jon Tompkins</span>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#projects" className="hover:text-zinc-100 transition-colors">Projects</a>
            <a href="#status" className="hover:text-zinc-100 transition-colors">Status</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Building AI-powered tools<br />
            <span className="text-zinc-500">that people actually use.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl">
            I design and build full-stack applications with AI agents at the core — from autonomous trading systems to ad marketplaces to visual memory protocols. Every project ships.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="https://github.com/jon-tompkins" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
            </a>
            <a href="mailto:Jon.tomp@gmail.com" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              <ArrowUpRight className="w-4 h-4" /> Contact
            </a>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.name} className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden hover:border-zinc-700 transition-colors">
                {project.preview && (
                  <div className="relative w-full h-44 overflow-hidden border-b border-zinc-800">
                    <Image
                      src={project.preview}
                      alt={`${project.name} screenshot`}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <project.icon className="w-5 h-5 text-zinc-400" />
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-indigo-400 font-medium mb-2">{project.tagline}</p>
                  <p className="text-sm text-zinc-400 mb-4">{project.description}</p>

                  <ul className="space-y-1 mb-4">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-zinc-500 flex items-start gap-2">
                        <span className="text-zinc-600 mt-0.5">→</span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {project.tech.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded text-xs">{t}</span>
                      ))}
                    </div>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 ml-3">
                        Live <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experimental */}
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-zinc-400 mb-6">Experimental</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experimental.map((project) => (
                <div key={project.name} className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <project.icon className="w-4 h-4 text-zinc-500" />
                      <h3 className="text-sm font-semibold text-zinc-300">{project.name}</h3>
                    </div>
                    <StatusBadge status="experimental" />
                  </div>
                  <p className="text-xs text-indigo-400/80 font-medium mb-1">{project.tagline}</p>
                  <p className="text-xs text-zinc-500 mb-3">{project.description}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-zinc-800/60 text-zinc-600 rounded text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stateboard */}
      <section id="status" className="py-20 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold mb-4">Stateboard</h2>
          <p className="text-zinc-500 mb-8 text-sm">Live status of all projects. Updated continuously.</p>

          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-zinc-900/50 text-xs font-medium text-zinc-500 border-b border-zinc-800">
              <span>Project</span>
              <span>Stage</span>
              <span>Health</span>
              <span>Feeling</span>
              <span>Notes</span>
            </div>
            {stateboard.map((row) => (
              <div key={row.name} className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 transition-colors">
                <span className="text-sm font-medium text-zinc-200">{row.name}</span>
                <span className="text-sm text-zinc-400">{row.stage}</span>
                <span className="text-lg">{row.health}</span>
                <span className="text-lg">{row.feeling}</span>
                <span className="text-xs text-zinc-500">{row.notes}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-zinc-600">
            Built with AI assistance. Every project designed, iterated, and shipped.
          </p>
        </div>
      </footer>
    </div>
  );
}
