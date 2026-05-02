import { create } from 'zustand'

interface CompareState {
  selectedIds: string[]
  toggle: (id: string) => void
  clear: () => void
  isSelected: (id: string) => boolean
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedIds: [],

  toggle: (id) =>
    set((state) => {
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((x) => x !== id) }
      }
      if (state.selectedIds.length >= 4) return state // max 4
      return { selectedIds: [...state.selectedIds, id] }
    }),

  clear: () => set({ selectedIds: [] }),

  isSelected: (id) => get().selectedIds.includes(id),
}))
