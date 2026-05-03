import React from 'react';
import { Palette, Type, Layout } from 'lucide-react';

export default function BrandbookPage() {
  return (
    <div className="min-h-screen bg-bg text-text p-8 md:p-16">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="space-y-4">
          <h1 className="text-5xl font-display text-accent">ChinaUni Brandbook</h1>
          <p className="text-xl text-text-muted">Refined editorial aesthetic + soft Asian minimalism.</p>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Palette className="text-accent" />
            <h2 className="text-3xl font-display">Color Palette</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ColorCard name="Accent (Chinese Red)" hex="#C0392B" varName="--clr-accent" />
            <ColorCard name="Accent 2 (Gold)" hex="#E8A000" varName="--clr-accent-2" />
            <ColorCard name="Background" hex="#F8F7F4" varName="--clr-bg" darkText />
            <ColorCard name="Surface" hex="#FFFFFF" varName="--clr-surface" darkText />
            <ColorCard name="Text Base" hex="#1A1A1A" varName="--clr-text" />
            <ColorCard name="Text Muted" hex="#6B6B6B" varName="--clr-text-muted" />
            <ColorCard name="Border" hex="#E2DFD9" varName="--clr-border" darkText />
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-4">League Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <BadgeColorCard name="C9 League" bg="bg-c9" />
            <BadgeColorCard name="Project 985" bg="bg-985" />
            <BadgeColorCard name="Project 211" bg="bg-211" />
            <BadgeColorCard name="HK Affiliated" bg="bg-hk" />
            <BadgeColorCard name="US/UK Affiliated" bg="bg-us" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Type className="text-accent" />
            <h2 className="text-3xl font-display">Typography</h2>
          </div>
          <div className="space-y-8">
            <div className="p-6 bg-surface border border-border rounded-xl">
              <p className="text-sm text-text-muted mb-2">Display Font (Headings)</p>
              <h1 className="text-5xl font-display">DM Serif Display / Playfair</h1>
              <p className="mt-4 text-lg">Used for page titles, university names, and large impact text.</p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-xl">
              <p className="text-sm text-text-muted mb-2">UI Font (Body)</p>
              <p className="text-2xl font-sans">Outfit / DM Sans</p>
              <p className="mt-4">Used for all interface elements, descriptions, and standard text.</p>
            </div>
            <div className="p-6 bg-surface border border-border rounded-xl">
              <p className="text-sm text-text-muted mb-2">Data Font (Numbers/Tables)</p>
              <p className="text-2xl font-mono">JetBrains Mono</p>
              <p className="mt-4 font-mono text-sm">QS #47 | IELTS 6.5 | ¥32,000</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorCard({ name, hex, varName, darkText = false }: { name: string, hex: string, varName: string, darkText?: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      <div className="h-24 w-full" style={{ backgroundColor: hex }}></div>
      <div className="p-4 bg-surface">
        <p className="font-bold text-sm mb-1">{name}</p>
        <p className="text-xs font-mono text-text-muted">{hex}</p>
        <p className="text-xs font-mono text-text-muted mt-1">{varName}</p>
      </div>
    </div>
  );
}

function BadgeColorCard({ name, bg }: { name: string, bg: string }) {
  return (
    <div className={`p-4 rounded-lg text-white font-bold text-center text-sm shadow-sm ${bg}`}>
      {name}
    </div>
  );
}
