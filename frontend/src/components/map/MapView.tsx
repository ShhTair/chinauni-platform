import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { universitiesApi } from '@/lib/api'
import { Stars, LeagueBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { University } from '@/types'

// Fix default icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createPrestigeIcon(stars: number): L.DivIcon {
  const colors: Record<number, string> = {
    5: '#C0392B',
    4: '#1D4ED8',
    3: '#6B7280',
    2: '#9CA3AF',
    1: '#D1D5DB',
  }
  const color = colors[stars] || '#9CA3AF'
  return L.divIcon({
    html: `<div style="
      width: 12px; height: 12px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    className: '',
  })
}

export function MapView() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['universities', 'map'],
    queryFn: () => universitiesApi.map(),
  })

  const universities: University[] = data?.data || []

  if (isLoading) {
    return (
      <div className="h-[600px] bg-bg rounded-2xl flex items-center justify-center">
        <div className="text-ink-muted">Загрузка карты...</div>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] rounded-2xl overflow-hidden border border-border">
      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-surface/95 backdrop-blur-sm rounded-xl border border-border p-3 text-xs">
        <p className="font-medium text-ink mb-2">Рейтинг</p>
        {[
          { stars: 5, label: '★★★★★ C9/Elite', color: '#C0392B' },
          { stars: 4, label: '★★★★ 985/Top', color: '#1D4ED8' },
          { stars: 3, label: '★★★ 211/Good', color: '#6B7280' },
          { stars: 2, label: '★★ Regional', color: '#9CA3AF' },
        ].map((item) => (
          <div key={item.stars} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: item.color }} />
            <span className="text-ink-muted">{item.label}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={[35.0, 105.0]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {universities.map((uni) => {
          if (!uni.coordinates) return null
          const { lat, lng } = uni.coordinates
          return (
            <Marker
              key={uni.id}
              position={[lat, lng]}
              icon={createPrestigeIcon(uni.prestige_stars || 1)}
            >
              <Popup>
                <div className="min-w-[200px] font-sans">
                  <p className="font-semibold text-sm text-ink leading-tight mb-1">{uni.name}</p>
                  {uni.name_cn && <p className="text-xs text-ink-muted mb-2">{uni.name_cn}</p>}
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    <Stars count={uni.prestige_stars} />
                    <LeagueBadge league={uni.league} />
                  </div>
                  <p className="text-xs text-ink-muted mb-3">{uni.city}, {uni.province}</p>
                  <button
                    onClick={() => navigate(`/universities/${uni.slug}`)}
                    className="w-full py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-dark transition-colors"
                  >
                    Открыть →
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
