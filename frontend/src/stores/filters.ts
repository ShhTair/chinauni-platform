import { create } from 'zustand'

export type ViewMode = 'table' | 'list' | 'grid' | 'map' | 'timeline'

interface FiltersState {
  search: string
  province: string
  league: string
  english_ug: string
  prestige_min: number | ''
  prestige_max: number | ''
  diploma_type: string
  sort: string
  page: number
  viewMode: ViewMode
  setFilter: (key: string, value: string | number | '') => void
  setViewMode: (mode: ViewMode) => void
  resetFilters: () => void
  nextPage: () => void
  prevPage: () => void
}

const defaults = {
  search: '',
  province: '',
  league: '',
  english_ug: '',
  prestige_min: '' as const,
  prestige_max: '' as const,
  diploma_type: '',
  sort: 'prestige_desc',
  page: 1,
  viewMode: 'grid' as ViewMode,
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...defaults,

  setFilter: (key, value) => set({ [key]: value, page: 1 } as Partial<FiltersState>),

  setViewMode: (mode) => set({ viewMode: mode }),

  resetFilters: () => set(defaults),

  nextPage: () => set((s) => ({ page: s.page + 1 })),
  prevPage: () => set((s) => ({ page: Math.max(1, s.page - 1) })),
}))
