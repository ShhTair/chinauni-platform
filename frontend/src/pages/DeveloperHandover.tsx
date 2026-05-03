import React from 'react';
import { Terminal, Database, Globe } from 'lucide-react';

export default function DeveloperHandover() {
  return (
    <div className="min-h-screen bg-bg text-text p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl font-display text-accent mb-4">Claude Code Handover</h1>
        <p className="text-xl text-text-muted mb-12">
          This page contains critical infrastructure context for the AI agent continuing the development.
        </p>

        <div className="bg-surface p-8 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
            <Globe className="text-blue-600" />
            <h2 className="text-2xl font-bold">Vercel Environment (Monorepo)</h2>
          </div>
          <p>
            The project is deployed as a Serverless Monorepo on Vercel. 
            The <code>vercel.json</code> in the root routes <code>/api/*</code> to <code>api/index.py</code> (FastAPI wrapper) 
            and everything else to the Vite React frontend.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 font-mono text-sm text-text-muted">
            <li>Frontend URL: https://china.tair.sh</li>
            <li>Backend API: https://china.tair.sh/api</li>
          </ul>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
            <Database className="text-green-600" />
            <h2 className="text-2xl font-bold">Database (Supabase PostgreSQL)</h2>
          </div>
          <p>
            We abandoned SQLite. The production database is hosted on Supabase and connected via a transaction pooler (port 6543) 
            to avoid IPv4/IPv6 conflicts with Vercel's serverless environment.
          </p>
          <p className="text-sm font-mono bg-bg p-3 rounded mt-4 border border-border">
            The tables are already migrated and seeded with 69 universities via Alembic. Do NOT drop or recreate tables destructively.
          </p>
        </div>

        
        <div className="bg-surface p-8 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
            <Terminal className="text-purple-600" />
            <h2 className="text-2xl font-bold">Secrets & Repository</h2>
          </div>
          <p>
            The project is tracked in GitHub. You can push your changes to trigger automatic deployments.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 font-mono text-sm text-text-muted">
            <li>GitHub Repo: <code>ShhTair/chinauni-platform</code></li>
            <li>Supabase Password (if manual migration needed): <code>3Sv1jVV9FSxbpD6D</code></li>
            <li>Supabase URI: <code>postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres</code></li>
            <li>Vercel Secrets: Already mapped via <code>vercel env</code>, do not hardcode in production.</li>
          </ul>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
            <Terminal className="text-purple-600" />
            <h2 className="text-2xl font-bold">Next Steps for Claude</h2>
          </div>
          <ol className="list-decimal pl-6 space-y-3 font-medium">
            <li>Review the <a href="/progress" className="text-accent underline">/progress</a> page to see what needs to be built.</li>
            <li>Implement the Data Fetching in <code>UniversityDetailPage.tsx</code> using TanStack Query.</li>
            <li>Connect the Intake Form (Stepper) to the backend <code>/api/intake</code> route.</li>
            <li>Do NOT touch the routing in <code>vercel.json</code> or the Nginx setups, it is working perfectly.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
