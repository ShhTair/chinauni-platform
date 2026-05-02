export interface University {
  id: string
  slug: string
  name: string
  name_cn?: string
  city?: string
  province?: string
  prestige_stars?: number
  league?: string
  diploma_type?: string
  english_ug?: string
  qs_rank?: number
  the_rank?: number
  intl_pct?: number
  url_info?: string
  url_portal?: string
  url_majors?: string
  url_deadlines?: string
  url_scholarships?: string
  ielts_min?: number
  app_fee_usd?: number
  tuition_cny_yr?: number
  portal_status?: string
  tier?: string
  notes_public?: string
  cover_image_url?: string
  logo_url?: string
  gallery_urls?: string[]
  google_maps_url?: string
  coordinates?: { lat: number; lng: number }
  majors?: Major[]
  scholarships?: Scholarship[]
  deadlines?: Deadline[]
}

export interface Major {
  id: string
  university_id: string
  major_name: string
  field?: string
  department?: string
  school_name?: string
  url_major_page?: string
  language?: string
  duration?: string
  tuition_override_cny?: number
  ielts_override?: number
  notes?: string
}

export interface Scholarship {
  id: string
  university_id?: string
  name: string
  type?: string
  coverage?: string
  amount_cny_yr?: number
  coverage_pct?: number
  conditions?: string
  deadline?: string
  url?: string
  renewable: boolean
  notes?: string
}

export interface Deadline {
  id: string
  university_id: string
  round_label?: string
  deadline_date?: string
  result_date?: string
  scholarship_eligible: boolean
  notes?: string
}

export interface Review {
  id: string
  user_id: string
  university_id: string
  rating: number
  body: string
  approved: boolean
  created_at: string
  author_name?: string
}

export interface User {
  id: string
  email: string
  role: string
  email_verified: boolean
  tg_username?: string
  instagram?: string
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  display_name?: string
  country_origin?: string
  current_city?: string
  bio?: string
  avatar_url?: string
  is_public: boolean
}

export interface UniversityListResponse {
  items: University[]
  total: number
  page: number
  limit: number
  pages: number
  authenticated: boolean
}

export interface UpcomingDeadline {
  id: string
  university_slug: string
  university_name: string
  university_logo?: string
  round_label?: string
  deadline_date?: string
  result_date?: string
  scholarship_eligible: boolean
}
