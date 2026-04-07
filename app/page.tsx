import { ArrowUpRight, Zap, Layers, Bot, BarChart3, Globe, Shield, Eye, Code2, Palette, Workflow, Boxes } from 'lucide-react';

const projects = [
  {
    name: 'Clawstreet',
    tagline: 'AI-powered trading platform',
    description: 'Real-time market analysis, paper trading, and portfolio management. Wolf autonomous trader makes his own decisions, learns from results, and refines strategy over time.',
    tech: ['Next.js', 'Python', 'xAI', 'Multi-agent'],
    icon: BarChart3,
    status: 'active',
    url: null,
    highlights: ['Autonomous paper trading with $1M starting balance', 'Wolf trader evaluates, executes, and journals trades', 'Scanner + evaluator pipeline for 25+ crypto assets'],
  },
  {
    name: 'Quillt',
    tagline: 'Fair market ad marketplace',
    description: 'Alternative to Google AdSense where publishers own their ad slots and set their own prices. Advertisers buy directly — no auctions, no 45% middleman cut.',
    tech: ['Next.js', 'NextAuth', 'Vercel', 'Harberger pricing'],
    icon: Globe,
    status: 'active',
    url: 'https://quillt.xyz',
    highlights: ['Publisher sets price, keeps 90% on every sale', 'Advertiser chooses duration, pays 10% APR holding cost', 'Auto-renew, buyout protection, slot returns to publisher on expiry'],
  },
  {
    name: 'MyJunto',
    tagline: 'Community coordination platform',
    description: 'Platform for community-driven content, coordination, and collaboration. Built as a gathering space for builders and creators.',
    tech: ['Next.js', 'Vercel'],
    icon: Layers,
    status: 'active',
    url: 'https://myjunto.xyz',
    highlights: ['Community-first design', 'Live and serving users'],
  },
  {
    name: 'Glyph',
    tagline: 'Visual memory system for AI agents',
    description: 'A compact visual language for encoding state, context, and meaning across AI agents. Compresses complex information ~6:1 versus text, enabling faster coordination and lower costs.',
    tech: ['Emoji grammar', 'Multi-agent coordination', 'Token optimization'],
    icon: Eye,
    status: 'prototype',
    url: null,
    highlights: ['2.4x faster agent coordination vs text', '55% lower token costs in A/B tests', 'Temporal glyphs track direction, velocity, timeframe'],
  },
  {
    name: 'Wolf',
    tagline: 'Autonomous trading agent',
    description: 'An AI agent that independently analyzes markets, generates trade ideas, executes paper trades, and learns from results. Runs on a daily schedule with autonomous decision-making.',
    tech: ['Python', 'Cron', 'Telegram API', 'xAI'],
    icon: Bot,
    status: 'active',
    url: null,
    highlights: ['Makes own trading decisions with $1M paper balance', 'Daily digest + learning loop', 'Tracks every action with notes for review'],
  },
  {
    name: 'Hawk',
    tagline: 'Flight deal scanner',
    description: 'Automated scanner monitoring flight prices from NYC to European destinations. Alerts when business class deals appear under $3K round-trip.',
    tech: ['Python', 'Kiwi API', 'Cron'],
    icon: Zap,
    status: 'awaiting API key',
    url: null,
    highlights: ['Targets 12 European cities', 'Business class under $3K RT', 'Daily automated scan'],
  },
  {
    name: 'Commit-Reveal System',
    tagline: 'Fair on-chain randomization',
    description: 'A commit-reveal scheme for fair, transparent on-chain randomization. Designed for games and applications requiring verifiable randomness.',
    tech: ['Solidity', 'Smart Contracts'],
    icon: Shield,
    status: 'built',
    url: null,
    highlights: ['Verifiable on-chain randomness', 'Fair game mechanics'],
  },
  {
    name: 'RPS',
    tagline: 'On-chain Rock Paper Scissors',
    description: 'Rock Paper Scissors with commit-reveal fairness, built as a proof of concept for trustless on-chain games.',
    tech: ['Solidity', 'Web3'],
    icon: Boxes,
    status: 'built',
    url: null,
    highlights: ['Commit-reveal for fair gameplay', 'Trustless on-chain execution'],
  },
];

const skills = [
  {
    category: 'AI & Agent Architecture',
    items: [
      { name: 'Multi-agent coordination', desc: 'Orchestrating specialized sub-agents for research, analysis, and execution' },
      { name: 'Autonomous agent loops', desc: 'Self-directing agents with scheduled evaluation and learning cycles' },
      { name: 'Visual memory (Glyph)', desc: 'Compact visual language for cross-agent state transfer' },
      { name: 'Stateboard system', desc: 'Real-time project health monitoring with visual indicators' },
    ],
    icon: Workflow,
  },
  {
    category: 'Full-Stack Development',
    items: [
      { name: 'Next.js / React', desc: 'Production apps deployed on Vercel' },
      { name: 'Python pipelines', desc: 'Cron-based data pipelines, scanners, and evaluators' },
      { name: 'API integrations', desc: 'Telegram, Google OAuth, crypto APIs, flight APIs' },
      { name: 'Smart contracts', desc: 'Solidity, commit-reveal, Harberger tax models' },
    ],
    icon: Code2,
  },
  {
    category: 'Product & Strategy',
    items: [
      { name: 'Market analysis', desc: 'Competitive positioning, pricing models, go-to-market' },
      { name: 'Ad tech architecture', desc: 'Alternative ad marketplace design, Harberger tax pricing' },
      { name: 'Rapid prototyping', desc: 'From concept to deployed MVP in days' },
    ],
    icon: Palette,
  },
];

const stateboard = [
  { name: 'Quillt', stage: 'active', health: '🟢', feeling: '✨', notes: 'Publisher + advertiser flows live, pricing updated' },
  { name: 'Wolf', stage: 'active', health: '🟢', feeling: '💪', notes: 'Autonomous trading, first position open' },
  { name: 'Clawstreet', stage: 'building', health: '🟡', feeling: '🛠️', notes: 'Trading platform in development' },
  { name: 'MyJunto', stage: 'live', health: '🟢', feeling: '🌱', notes: 'Community platform serving users' },
  { name: 'Hawk', stage: 'blocked', health: '🟡', feeling: '💤', notes: 'Awaiting API key' },
  { name: 'Glyph', stage: 'prototype', health: '🟢', feeling: '🤔', notes: 'A/B tested, 6:1 compression, exploring applications' },
  { name: 'Portfolio', stage: 'building', health: '🟢', feeling: '🚀', notes: 'This site' },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    live: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    building: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    prototype: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    built: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
    blocked: 'bg-red-500/10 text-red-400 ring-red-500/20',
    'awaiting API key': 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
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
          <span className="text-lg font-semibold text-white">Jon Tompkins</span>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#projects" className="hover:text-zinc-100 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-zinc-100 transition-colors">Skills</a>
            <a href="#status" className="hover:text-zinc-100 transition-colors">Status</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">
            Building AI-powered tools<br />
            <span className="text-indigo-400">that people actually use.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl">
            I design and build full-stack applications with AI agents at the core — from autonomous trading systems to ad marketplaces to visual memory protocols. Every project ships.
          </p>
          <div className="mt-8 flex gap-6">
            <a href="https://github.com/jon-tompkins" target="_blank" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
            </a>
            <a href="https://linkedin.com/in/jontompkins" target="_blank" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn
            </a>
            <a href="https://x.com/jontom" target="_blank" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X
            </a>
            <a href="mailto:Jon.tomp@gmail.com" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" /> Email
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
              <div key={project.name} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <project.icon className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-indigo-400 font-medium mb-2">{project.tagline}</p>
                <p className="text-sm text-zinc-400 mb-4">{project.description}</p>
                
                {project.highlights && (
                  <ul className="space-y-1 mb-4">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-zinc-500 flex items-start gap-2">
                        <span className="text-zinc-600 mt-0.5">→</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded text-xs">{t}</span>
                    ))}
                  </div>
                  {project.url && (
                    <a href={project.url} target="_blank" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      Live <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20 border-t border-zinc-800/50 bg-zinc-900/20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold mb-12">Skills & Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-2 mb-4">
                  <group.icon className="w-4 h-4 text-zinc-500" />
                  <h3 className="font-semibold text-zinc-200">{group.category}</h3>
                </div>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.name}>
                      <p className="text-sm font-medium text-zinc-300">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
