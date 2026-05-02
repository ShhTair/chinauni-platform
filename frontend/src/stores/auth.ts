import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { authApi } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await authApi.login(email, password)
          const token = res.data.access_token
          localStorage.setItem('token', token)
          set({ token, isLoading: false })
          await get().fetchMe()
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      register: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await authApi.register(email, password)
          const token = res.data.access_token
          localStorage.setItem('token', token)
          set({ token, isLoading: false })
          await get().fetchMe()
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },

      fetchMe: async () => {
        try {
          const res = await authApi.me()
          set({ user: res.data })
        } catch {
          set({ user: null, token: null })
          localStorage.removeItem('token')
        }
      },
    }),
    {
      name: 'chinauni-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
