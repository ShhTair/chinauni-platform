import { motion } from 'framer-motion'
import { X, SlidersHorizontal, Check } from 'lucide-react'
import { useFiltersStore } from '@/stores/filters'
import { Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

const PROVINCES = [
  'Beijing', 'Shanghai', 'Guangdong', 'Zhejiang', 'Jiangsu', 'Hubei',
  'Sichuan', 'Shaanxi', 'Liaoning', 'Heilongjiang', 'Jilin', 'Shandong',
  'Hunan', 'Anhui', 'Fujian', 'Jiangxi', 'Chongqing', 'Xinjiang', 'Yunnan',
  'Guangxi', 'Qinghai', 'Ningxia', 'Gansu', 'Inner Mongolia', 'Tianjin',
]

const LEAGUES = ['C9', '985', '211', 'HK-Affiliated', 'US-Affiliated', 'UK-Affiliated', 'Private']
const DIPLOMA_TYPES = ['Chinese', 'US', 'UK', 'HK', 'Dual']
const FIELDS = ['AI', 'Data Science', 'Business', 'CS', 'EE', 'Finance', 'Engineering', 'Medicine', 'Arts']

interface FilterSidebarProps {
  mobile?: boolean
  onClose?: () => void
}

function MultiSelectPill({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border whitespace-nowrap",
        active 
          ? "bg-accent text-white border-accent shadow-sm" 
          : "bg-surface text-ink-muted border-border hover:border-ink-muted/50 hover:bg-bg"
      )}
    >
      {label}
    </button>
  )
}

export function FilterSidebar({ mobile, onClose }: FilterSidebarProps) {
  const filters = useFiltersStore()

  const activeCount = 
    filters.provinces.length + 
    filters.leagues.length + 
    filters.diploma_types.length + 
    filters.fields.length + 
    (filters.english_ug ? 1 : 0) + 
    (filters.prestige_min ? 1 : 0) + 
    (filters.prestige_max ? 1 : 0)

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-ink-muted" />
          <h3 className="font-display text-lg text-ink">Filters</h3>
          {activeCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-accent text-white text-xs font-bold shadow-sm">
              {activeCount}
            </span>
          )}
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="p-1 rounded-md hover:bg-bg text-ink-muted">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Leagues */}
        <div>
          <label className="block text-xs font-bold text-ink-muted mb-3 uppercase tracking-wider">League</label>
          <div className="flex flex-wrap gap-2">
            {LEAGUES.map(league => (
              <MultiSelectPill
                key={league}
                label={league}
                active={filters.leagues.includes(league)}
                onClick={() => filters.toggleArrayFilter('leagues', league)}
              />
            ))}
          </div>
        </div>

        {/* Fields / Majors */}
        <div>
          <label className="block text-xs font-bold text-ink-muted mb-3 uppercase tracking-wider">Major Field</label>
          <div className="flex flex-wrap gap-2">
            {FIELDS.map(field => (
              <MultiSelectPill
                key={field}
                label={field}
                active={filters.fields.includes(field)}
                onClick={() => filters.toggleArrayFilter('fields', field)}
              />
            ))}
          </div>
        </div>

        {/* Provinces */}
        <div>
          <label className="block text-xs font-bold text-ink-muted mb-3 uppercase tracking-wider">Province / City</label>
          <div className="flex flex-wrap gap-2">
            {PROVINCES.map(prov => (
              <MultiSelectPill
                key={prov}
                label={prov}
                active={filters.provinces.includes(prov)}
                onClick={() => filters.toggleArrayFilter('provinces', prov)}
              />
            ))}
          </div>
        </div>

        {/* Diploma Types */}
        <div>
          <label className="block text-xs font-bold text-ink-muted mb-3 uppercase tracking-wider">Diploma</label>
          <div className="flex flex-wrap gap-2">
            {DIPLOMA_TYPES.map(dip => (
              <MultiSelectPill
                key={dip}
                label={dip}
                active={filters.diploma_types.includes(dip)}
                onClick={() => filters.toggleArrayFilter('diploma_types', dip)}
              />
            ))}
          </div>
        </div>

        {/* English UG & Prestige */}
        <div className="grid grid-cols-1 gap-5 pt-2">
          <div>
            <label className="block text-xs font-bold text-ink-muted mb-2 uppercase tracking-wider">English Undergrad</label>
            <Select
              value={filters.english_ug}
              onChange={(e) => filters.setFilter('english_ug', e.target.value)}
            >
              <option value="">All</option>
              <option value="yes">Yes (Fully English)</option>
              <option value="partial">Partial</option>
              <option value="no">No (Chinese only)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-muted mb-2 uppercase tracking-wider">Prestige (Stars)</label>
            <div className="flex items-center gap-2">
              <Select
                value={filters.prestige_min}
                onChange={(e) => filters.setFilter('prestige_min', e.target.value)}
              >
                <option value="">Min</option>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={`min-${v}`} value={v}>{v} ★</option>
                ))}
              </Select>
              <span className="text-ink-faint">-</span>
              <Select
                value={filters.prestige_max}
                onChange={(e) => filters.setFilter('prestige_max', e.target.value)}
              >
                <option value="">Max</option>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={`max-${v}`} value={v}>{v} ★</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="pt-4 border-t border-border mt-4">
          <Button
            variant="outline"
            className="w-full text-xs font-bold uppercase tracking-wider"
            onClick={() => {
              filters.resetFilters()
              if (mobile && onClose) onClose()
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
