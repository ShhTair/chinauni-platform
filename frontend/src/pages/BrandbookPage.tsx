import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Palette, Type, Layout, Box, Zap,
  CheckCircle2, AlertCircle, Info, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge, LeagueBadge, PortalBadge, TierBadge, Stars } from '@/components/ui/Badge'
import {
  UniCardGridSkeleton, UniCardListSkeleton,
  UniversityDetailSkeleton, Skeleton
} from '@/components/ui/Skeleton'

// ── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <Icon size={18} className="text-accent" />
        <h2 className="font-display text-2xl text-ink">{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}

// ── Swatch ──────────────────────────────────────────────────────────────────
function Swatch({ name, hex, varName, textClass = 'text-white', extra = '' }: {
  name: string; hex?: string; varName?: string; textClass?: string; extra?: string
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      <div
        className={`h-20 w-full flex items-end p-2 ${extra}`}
        style={hex ? { backgroundColor: hex } : undefined}
      />
      <div className="p-3 bg-surface space-y-0.5">
        <p className="font-medium text-xs text-ink">{name}</p>
        {hex && <p className="text-[10px] font-mono-data text-ink-faint">{hex}</p>}
        {varName && <p className="text-[10px] font-mono-data text-ink-muted">{varName}</p>}
      </div>
    </div>
  )
}

// ── Code snippet ─────────────────────────────────────────────────────────────
function Code({ children }: { children: string }) {
  return (
    <code className="inline-flex items-center px-2 py-0.5 rounded bg-bg border border-border font-mono-data text-accent text-xs">
      {children}
    </code>
  )
}

export default function BrandbookPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [inputVal, setInputVal] = useState('')

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero ── */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-mono-data text-ink-faint border border-border rounded px-2 py-0.5 uppercase tracking-widest">
                Design System
              </span>
            </div>
            <h1 className="font-display text-6xl text-ink mb-3">
              China<span className="text-accent">Uni</span> Brandbook
            </h1>
            <p className="text-xl text-ink-muted max-w-2xl">
              Refined editorial aesthetic · Chinese red accent · Warm serif headings · Clean UI typography
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* ══════════════════ COLORS ══════════════════ */}
        <Section title="Color Palette" icon={Palette}>
          <div>
            <p className="text-sm text-ink-muted mb-4 font-medium">Core semantic tokens — auto-switch in dark mode</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <Swatch name="Accent" hex="#C0392B" varName="--clr-accent" />
              <Swatch name="Gold" hex="#E8A000" varName="--clr-accent-2" />
              <Swatch name="Background" varName="--rgb-bg" extra="bg-bg" textClass="text-ink" />
              <Swatch name="Surface" varName="--rgb-surface" extra="bg-surface border border-border" textClass="text-ink" />
              <Swatch name="Border" varName="--rgb-border" extra="bg-border" textClass="text-ink" />
              <Swatch name="Ink" varName="--rgb-text" extra="bg-ink" />
              <Swatch name="Ink Muted" varName="--rgb-text-muted" extra="bg-ink-muted" />
              <Swatch name="Ink Faint" varName="--rgb-text-faint" extra="bg-ink-faint" />
            </div>
          </div>
          <div>
            <p className="text-sm text-ink-muted mb-4 font-medium">League badge colours — static (no dark mode switch)</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'C9 League',       cls: 'bg-c9' },
                { label: 'Project 985',     cls: 'bg-l985' },
                { label: 'Project 211',     cls: 'bg-l211' },
                { label: 'HK Affiliated',   cls: 'bg-hk' },
                { label: 'US Affiliated',   cls: 'bg-us' },
                { label: 'UK Affiliated',   cls: 'bg-uk' },
              ].map(({ label, cls }) => (
                <div key={label} className={`px-4 py-2 rounded-lg text-white text-xs font-bold ${cls}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══════════════════ TYPOGRAPHY ══════════════════ */}
        <Section title="Typography" icon={Type}>
          <div className="space-y-6">
            {[
              { label: 'Display / Headings', className: 'font-display text-5xl text-ink', text: 'DM Serif Display' },
              { label: 'UI / Body — Outfit', className: 'font-sans text-2xl text-ink', text: 'Outfit · Regular / Medium / Bold' },
              { label: 'Data / Code — JetBrains Mono', className: 'font-mono-data text-xl text-ink', text: 'QS #47 | IELTS 6.5 | ¥32,000/yr' },
            ].map(({ label, className, text }) => (
              <div key={label} className="p-6 bg-surface border border-border rounded-2xl">
                <p className="text-xs font-medium text-ink-faint mb-3 uppercase tracking-widest">{label}</p>
                <p className={className}>{text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              { label: 'H1',       cls: 'font-display text-4xl' },
              { label: 'H2',       cls: 'font-display text-3xl' },
              { label: 'H3',       cls: 'font-display text-2xl' },
              { label: 'Body',     cls: 'font-sans text-base' },
              { label: 'Small',    cls: 'font-sans text-sm' },
              { label: 'Tiny',     cls: 'font-sans text-xs' },
              { label: 'Mono SM',  cls: 'font-mono-data text-sm' },
              { label: 'Mono XS',  cls: 'font-mono-data text-xs' },
            ].map(({ label, cls }) => (
              <div key={label} className="p-3 bg-bg rounded-xl border border-border">
                <p className="text-[10px] text-ink-faint mb-1 uppercase tracking-wider">{label}</p>
                <p className={`${cls} text-ink`}>China Uni</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ══════════════════ BUTTONS ══════════════════ */}
        <Section title="Buttons" icon={Box}>
          <div className="space-y-4">
            {/* Variants */}
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            {/* Sizes */}
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Large</Button>
                <Button size="md">Medium</Button>
                <Button size="sm">Small</Button>
              </div>
            </div>
            {/* States */}
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">States</p>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════ FORM INPUTS ══════════════════ */}
        <Section title="Form Inputs" icon={Layout}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            <Input
              label="Text Input"
              placeholder="Enter university name..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
            />
            <Input
              label="With error"
              placeholder="bad@email"
              error="Please enter a valid email address"
            />
            <Input
              label="With hint"
              placeholder="your@email.com"
              hint="We'll send your credentials here"
            />
            <Select
              label="Select"
              value=""
              onChange={() => {}}
              options={[
                { value: 'bachelor', label: 'Bachelor' },
                { value: 'master', label: 'Master' },
                { value: 'phd', label: 'PhD' },
              ]}
              placeholder="Choose degree level"
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Textarea"
                placeholder="Tell us about your experience applying to Chinese universities..."
                rows={3}
              />
            </div>
          </div>
        </Section>

        {/* ══════════════════ BADGES ══════════════════ */}
        <Section title="Badges & Status" icon={Zap}>
          <div className="space-y-5">
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">League Badges</p>
              <div className="flex flex-wrap gap-2">
                {(['C9','985','211','HK-Affiliated','US-Affiliated','UK-Affiliated','Private'] as const).map(l => (
                  <LeagueBadge key={l} league={l} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Portal Status</p>
              <div className="flex gap-3">
                <PortalBadge status="OPEN" />
                <PortalBadge status="CLOSED" />
                <PortalBadge status="SOON" />
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Tier</p>
              <div className="flex gap-3">
                <TierBadge tier="REACH" />
                <TierBadge tier="TARGET" />
                <TierBadge tier="SAFETY" />
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Stars (Prestige 1–5)</p>
              <div className="flex flex-col gap-2">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className="flex items-center gap-3">
                    <Stars count={n} />
                    <span className="text-xs text-ink-muted">{n} star{n !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════ TOASTS ══════════════════ */}
        <Section title="Toast Notifications" icon={Zap}>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast.success('Operation successful ✓')}>
              <CheckCircle2 size={14} className="text-green-500" /> Success toast
            </Button>
            <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
              <AlertCircle size={14} className="text-red-500" /> Error toast
            </Button>
            <Button variant="outline" onClick={() => toast('Neutral notification', { icon: '📋' })}>
              <Info size={14} /> Info toast
            </Button>
            <Button variant="outline" onClick={() => toast.warning('Please review before submitting')}>
              <AlertTriangle size={14} className="text-amber-500" /> Warning toast
            </Button>
          </div>
          <p className="text-xs text-ink-muted">
            Using <Code>sonner</Code> — positioned <Code>bottom-right</Code>, styled with Outfit font and brand border colours.
          </p>
        </Section>

        {/* ══════════════════ MODAL ══════════════════ */}
        <Section title="Modal" icon={Box}>
          <div className="p-6 bg-surface border border-border rounded-2xl space-y-3">
            <p className="text-sm text-ink-muted">
              Framer Motion animated modal with backdrop blur, <Code>bg-surface</Code> background,
              and <Code>border-border</Code> dividers — all theme-aware.
            </p>
            <Button onClick={() => setModalOpen(true)}>Open example modal</Button>
          </div>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
            <div className="space-y-4">
              <p className="text-sm text-ink-muted">
                This modal uses <Code>bg-surface</Code> and will correctly switch to the dark surface colour in dark mode.
              </p>
              <Input label="Input inside modal" placeholder="Works in dark mode too..." />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={() => { setModalOpen(false); toast.success('Saved!') }}>Save</Button>
              </div>
            </div>
          </Modal>
        </Section>

        {/* ══════════════════ SKELETONS ══════════════════ */}
        <Section title="Skeleton Loaders" icon={Box}>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Base skeleton</p>
              <div className="space-y-2 max-w-sm">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">University card grid (×3)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <UniCardGridSkeleton />
                <UniCardGridSkeleton />
                <UniCardGridSkeleton />
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">University card list (×2)</p>
              <div className="space-y-3 max-w-2xl">
                <UniCardListSkeleton />
                <UniCardListSkeleton />
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════ SPACING & RADIUS ══════════════════ */}
        <Section title="Spacing & Radius" icon={Layout}>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Border radius scale</p>
              <div className="flex flex-wrap items-end gap-4">
                {[
                  { cls: 'rounded-lg',    label: 'lg · 8px' },
                  { cls: 'rounded-xl',    label: 'xl · 12px' },
                  { cls: 'rounded-2xl',   label: '2xl · 16px' },
                  { cls: 'rounded-3xl',   label: '3xl · 24px' },
                  { cls: 'rounded-full',  label: 'full' },
                ].map(({ cls, label }) => (
                  <div key={cls} className="text-center">
                    <div className={`w-14 h-14 bg-accent/15 border-2 border-accent/30 ${cls}`} />
                    <p className="text-[10px] font-mono-data text-ink-faint mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-medium">Shadow scale</p>
              <div className="flex flex-wrap gap-6">
                {[
                  { cls: 'shadow-sm',          label: 'sm' },
                  { cls: 'shadow-card',        label: 'card' },
                  { cls: 'shadow-card-hover',  label: 'card-hover' },
                  { cls: 'shadow-accent',      label: 'accent' },
                ].map(({ cls, label }) => (
                  <div key={label} className="text-center">
                    <div className={`w-16 h-16 bg-surface rounded-xl ${cls}`} />
                    <p className="text-[10px] font-mono-data text-ink-faint mt-2">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ══════════════════ DARK MODE TEST ══════════════════ */}
        <Section title="Dark Mode Test" icon={Palette}>
          <p className="text-sm text-ink-muted mb-4">
            Toggle dark mode with the <Code>☀/🌙</Code> button in the navbar. All tokens below should switch correctly.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              { label: 'bg-bg',           cls: 'bg-bg border border-border' },
              { label: 'bg-bg-warm',      cls: 'bg-bg-warm border border-border' },
              { label: 'bg-surface',      cls: 'bg-surface border border-border' },
              { label: 'bg-border',       cls: 'bg-border' },
              { label: 'text-ink',        cls: 'bg-surface border border-border', textCls: 'text-ink' },
              { label: 'text-ink-muted',  cls: 'bg-surface border border-border', textCls: 'text-ink-muted' },
              { label: 'text-ink-faint',  cls: 'bg-surface border border-border', textCls: 'text-ink-faint' },
              { label: 'text-accent',     cls: 'bg-surface border border-border', textCls: 'text-accent' },
            ].map(({ label, cls, textCls }) => (
              <div key={label} className={`p-3 rounded-xl ${cls}`}>
                <p className={`font-mono-data text-xs ${textCls || 'text-ink'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Section>

      </div>

      {/* Footer */}
      <div className="border-t border-border mt-8">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-ink-faint">
          <span className="font-mono-data">ChinaUni Design System v1.0</span>
          <span>DM Serif Display · Outfit · JetBrains Mono</span>
        </div>
      </div>
    </div>
  )
}
