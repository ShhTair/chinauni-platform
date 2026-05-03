import React from 'react';
import { CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react';

type Status = 'done' | 'in_progress' | 'todo' | 'issue';

const FEATURES = [
  { group: 'Infrastructure', name: 'FastAPI Backend setup', status: 'done', note: 'Vercel Serverless implementation' },
  { group: 'Infrastructure', name: 'Database setup', status: 'done', note: 'Supabase PostgreSQL via transaction pooler' },
  { group: 'Infrastructure', name: 'Auto-deploy CI/CD', status: 'done', note: 'Vercel monorepo automatic deploys' },
  { group: 'Authentication', name: 'JWT Auth (Login/Register)', status: 'done', note: 'Owner/Admin endpoints work. Needs UI integration.' },
  { group: 'Catalog', name: 'University Table View', status: 'done', note: '@tanstack/react-table implemented' },
  { group: 'Catalog', name: 'University Map View', status: 'done', note: 'Lazy loaded React Leaflet added, missing dynamic coordinates' },
  { group: 'Catalog', name: 'Timeline View (Deadlines)', status: 'done', note: 'Horizontal timeline created with month-based layout' },
  { group: 'Universities', name: 'Detail Page', status: 'done', note: 'Real images added to DB, Tabs and Hero sections populated' },
  { group: 'Universities', name: 'Anti-copy Protection', status: 'done', note: 'Right-click and text-selection disabled via protection.ts' },
  { group: 'UI/UX', name: 'Loading States & Toasts', status: 'done', note: 'Skeleton loaders and toast notifications added' },
  { group: 'UI/UX', name: 'Dark / Light Theme', status: 'in_progress', note: 'CSS variable RGB tokens wired to Tailwind — full dark mode pass in progress' },
  { group: 'UI/UX', name: 'Design System / Brandbook', status: 'in_progress', note: 'Full component showcase at /brandbook — all tokens, typography, badges, toasts, modals, skeletons' },
  { group: 'Infrastructure', name: 'Vercel SPA routing fix', status: 'done', note: 'vercel.json rewrites added; /brandbook, /progress, /handover now load correctly' },
  { group: 'Forms', name: 'Intake Form (Stepper)', status: 'in_progress', note: 'UI built, needs connection to backend /api/intake' },
  { group: 'Admin', name: 'Moderator Dashboard', status: 'in_progress', note: 'Submissions/Reviews approval logic pending' },
];

export default function ProgressPage() {
  const getStatusIcon = (status: Status) => {
    switch(status) {
      case 'done': return <CheckCircle2 className="text-green-500 w-5 h-5" />;
      case 'in_progress': return <Clock className="text-accent-2 w-5 h-5" />;
      case 'issue': return <AlertCircle className="text-accent w-5 h-5" />;
      default: return <Circle className="text-border w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display text-accent mb-8">Project Roadmap & Status</h1>
        
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg border-b border-border text-sm text-text-muted">
              <tr>
                <th className="p-4 font-medium">Module</th>
                <th className="p-4 font-medium">Feature</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FEATURES.map((f, i) => (
                <tr key={i} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 font-medium text-sm text-text-muted">{f.group}</td>
                  <td className="p-4 font-bold">{f.name}</td>
                  <td className="p-4 flex justify-center">{getStatusIcon(f.status as Status)}</td>
                  <td className="p-4 text-sm text-text-muted">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
