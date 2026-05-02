import { motion } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'
import { useFiltersStore } from '@/stores/filters'
import { Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const PROVINCES = [
  'Beijing', 'Shanghai', 'Guangdong', 'Zhejiang', 'Jiangsu', 'Hubei',
  'Sichuan', 'Shaanxi', 'Liaoning', 'Heilongjiang', 'Jilin', 'Shandong',
  'Hunan', 'Anhui', 'Fujian', 'Jiangxi', 'Chongqing', 'Xinjiang', 'Yunnan',
  'Guangxi', 'Qinghai', 'Ningxia', 'Gansu', 'Inner Mongolia', 'Tianjin',
]

const LEAGUES = ['C9', '985', '211', 'HK-Affiliated', 'US-Affiliated', 'UK-Affiliated', 'Private']
const DIPLOMA_TYPES = ['Chinese', 'US', 'UK', 'HK', 'Dual']

interface FilterSidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export function FilterSidebar({ mobile, onClose }: FilterSidebarProps) {
  const filters = useFiltersStore()

  const activeCount = [
    filters.province, filters.league, filters.english_ug,
    filters.diploma_type, filters.prestige_min, filters.prestige_max
  ].filter(Boolean).length

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-ink-muted" />
          <h3 className="font-medium text-ink text-sm">Фильтры</h3>
          {activeCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={filters.resetFilters}
              className="text-xs text-accent hover:underline"
            >
              Сбросить
            </button>
          )}
          {mobile && onClose && (
            <button onClick={onClose} className="p-1 rounded hover:bg-bg">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2 block">
          Поиск
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => filters.setFilter('search', e.target.value)}
          placeholder="Название университета..."
          className="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Province */}
      <Select
        label="Провинция"
        value={filters.province}
        onChange={(e) => filters.setFilter('province', e.target.value)}
        placeholder="Все провинции"
        options={PROVINCES.map((p) => ({ value: p, label: p }))}
      />

      {/* League */}
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2 block">
          Лига/категория
        </label>
        <div className="flex flex-wrap gap-1.5">
          {LEAGUES.map((l) => (
            <button
              key={l}
              onClick={() => filters.setFilter('league', filters.league === l ? '' : l)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                filters.league === l
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg text-ink-muted border-border hover:border-accent hover:text-accent'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* English UG */}
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2 block">
          Программы на английском
        </label>
        <div className="flex gap-1.5">
          {[
            { value: 'yes', label: 'Да' },
            { value: 'partial', label: 'Частично' },
            { value: 'no', label: 'Нет' },
          ].map((o) => (
            <button
              key={o.value}
              onClick={() => filters.setFilter('english_ug', filters.english_ug === o.value ? '' : o.value)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                filters.english_ug === o.value
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg text-ink-muted border-border hover:border-accent'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Diploma type */}
      <Select
        label="Тип диплома"
        value={filters.diploma_type}
        onChange={(e) => filters.setFilter('diploma_type', e.target.value)}
        placeholder="Любой"
        options={DIPLOMA_TYPES.map((t) => ({ value: t, label: t }))}
      />

      {/* Prestige */}
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2 block">
          Рейтинг (★)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1} max={5}
            value={filters.prestige_min}
            onChange={(e) => filters.setFilter('prestige_min', e.target.value ? +e.target.value : '')}
            placeholder="От"
            className="w-full px-2 py-1.5 rounded-lg border border-border bg-bg text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          <span className="text-ink-muted">—</span>
          <input
            type="number"
            min={1} max={5}
            value={filters.prestige_max}
            onChange={(e) => filters.setFilter('prestige_max', e.target.value ? +e.target.value : '')}
            placeholder="До"
            className="w-full px-2 py-1.5 rounded-lg border border-border bg-bg text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>

      {/* Sort */}
      <Select
        label="Сортировка"
        value={filters.sort}
        onChange={(e) => filters.setFilter('sort', e.target.value)}
        options={[
          { value: 'prestige_desc', label: 'По рейтингу (★)' },
          { value: 'qs_rank_asc', label: 'QS Rank' },
          { value: 'province_asc', label: 'Провинция А→Я' },
        ]}
      />
    </div>
  )
}
