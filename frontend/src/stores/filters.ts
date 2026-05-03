import { create } from 'zustand'

export type ViewMode = 'table' | 'list' | 'grid' | 'map' | 'timeline'

interface FiltersState {
  search: string
  provinces: string[]
  leagues: string[]
  english_ug: string
  prestige_min: number | ''
  prestige_max: number | ''
  diploma_types: string[]
  fields: string[]
  sort: string
  page: number
  viewMode: ViewMode
  isFullWidth: boolean
  setFilter: (key: string, value: string | number | '' | string[]) => void
  toggleArrayFilter: (key: 'provinces' | 'leagues' | 'diploma_types' | 'fields', value: string) => void
  setViewMode: (mode: ViewMode) => void
  setIsFullWidth: (val: boolean) => void
  resetFilters: () => void
  nextPage: () => void
  prevPage: () => void
}

const defaults = {
  search: '',
  provinces: [],
  leagues: [],
  english_ug: '',
  prestige_min: '' as const,
  prestige_max: '' as const,
  diploma_types: [],
  fields: [],
  sort: 'prestige_desc',
  page: 1,
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...defaults,
  viewMode: 'grid' as ViewMode,
  isFullWidth: false,

  setFilter: (key, value) => set({ [key]: value, page: 1 } as Partial<FiltersState>),
  
  toggleArrayFilter: (key, value) => set((state) => {
    const arr = state[key];
    const newArr = arr.includes(value) 
      ? arr.filter(v => v !== value) 
      : [...arr, value];
    return { [key]: newArr, page: 1 } as Partial<FiltersState>;
  }),

  setViewMode: (mode) => set({ viewMode: mode }),
  setIsFullWidth: (isFullWidth) => set({ isFullWidth }),
  resetFilters: () => set(defaults),

  nextPage: () => set((s) => ({ page: s.page + 1 })),
  prevPage: () => set((s) => ({ page: Math.max(1, s.page - 1) })),
}))
