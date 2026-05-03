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
  adminLogin: (password: string) => Promise<void>
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


      adminLogin: async (password: string) => {
        set({ isLoading: true });
        try {
            // Mock admin login since backend doesn't have standard /api/auth/login for admin123
            if (password === 'admin123') {
                const mockUser = {
                    id: 'admin_1',
                    email: 'admin@chinauni.kz',
                    role: 'admin',
                    created_at: new Date().toISOString()
                };
                set({ user: mockUser as any, token: 'mock_admin_token', isLoading: false });
                localStorage.setItem('token', 'mock_admin_token');
                return;
            }
            throw new Error("Invalid password");
        } catch (e) {
            set({ isLoading: false });
            throw e;
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
