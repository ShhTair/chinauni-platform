import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──
export const authApi = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
}

// ── Universities ──
export const universitiesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get('/universities', { params }),
  get: (slug: string) => api.get(`/universities/${slug}`),
  map: () => api.get('/universities/map'),
  getMajors: (slug: string) => api.get(`/universities/${slug}/majors`),
  getScholarships: (slug: string) => api.get(`/universities/${slug}/scholarships`),
  getDeadlines: (slug: string) => api.get(`/universities/${slug}/deadlines`),
  getReviews: (slug: string) => api.get(`/universities/${slug}/reviews`),
  postReview: (slug: string, data: { rating: number; body: string }) =>
    api.post(`/universities/${slug}/reviews`, data),
}

// ── Scholarships ──
export const scholarshipsApi = {
  list: () => api.get('/scholarships'),
}

// ── Deadlines ──
export const deadlinesApi = {
  upcoming: () => api.get('/deadlines/upcoming'),
}

// ── Intake ──
export const intakeApi = {
  submit: (slug: string, data: Record<string, unknown>) =>
    api.post(`/intake/${slug}`, data),
}

// ── Profile ──
export const profileApi = {
  get: (userId: string) => api.get(`/profile/${userId}`),
  update: (data: Record<string, unknown>) => api.put('/profile/me', data),
}

// ── Admin ──
export const adminApi = {
  submissions: (status = 'pending') => api.get('/admin/submissions', { params: { status } }),
  reviewSubmission: (id: string, action: string, note = '') =>
    api.put(`/admin/submissions/${id}`, null, { params: { action, moderator_note: note } }),
  reviews: (approved = false) => api.get('/admin/reviews', { params: { approved } }),
  reviewReview: (id: string, action: string) =>
    api.put(`/admin/reviews/${id}`, null, { params: { action } }),
  users: () => api.get('/admin/users'),
}
