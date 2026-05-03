import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { universitiesApi } from '@/lib/api'
import { Stars, LeagueBadge } from '@/components/ui/Badge'
import type { University } from '@/types'

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
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
      width: 14px; height: 14px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    className: 'custom-leaflet-icon',
  })
}

export function MapView() {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { data, isLoading } = useQuery({
    queryKey: ['universities', 'map'],
    queryFn: () => universitiesApi.map(),
  })

  const universities: University[] = data?.data || []

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-200px)] min-h-[600px] bg-bg rounded-2xl flex items-center justify-center">
        <div className="text-ink-muted font-medium animate-pulse">Loading Map...</div>
      </div>
    )
  }

  return (
    <div className="relative h-[calc(100vh-200px)] min-h-[600px] rounded-2xl overflow-hidden border border-border shadow-sm">
      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-surface/95 backdrop-blur-sm rounded-xl border border-border p-3 text-xs shadow-md">
        <p className="font-bold text-ink mb-2">Prestige</p>
        {[
          { stars: 5, label: '★★★★★ C9/Elite', color: '#C0392B' },
          { stars: 4, label: '★★★★ 985/Top', color: '#1D4ED8' },
          { stars: 3, label: '★★★ 211/Good', color: '#6B7280' },
          { stars: 2, label: '★★ Regional', color: '#9CA3AF' },
        ].map((item) => (
          <div key={item.stars} className="flex items-center gap-2 mb-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-ink-muted font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={[35.0, 105.0]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        className="z-0 bg-[#E8E6E0]"
        zoomControl={false}
      >
        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked name="Light Map (English)">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark Map">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {universities.map((uni) => {
          if (!uni.coordinates) return null
          const { lat, lng } = uni.coordinates
          const isHovered = hoveredId === uni.id

          return (
            <Marker
              key={uni.id}
              position={[lat, lng]}
              icon={createPrestigeIcon(uni.prestige_stars || 1)}
              eventHandlers={{
                mouseover: () => setHoveredId(uni.id),
                mouseout: () => setHoveredId(null),
                click: () => navigate(`/universities/${uni.slug}`),
              }}
            >
              <Tooltip permanent={true} direction="top" offset={[0, -10]} opacity={0.8} className="bg-transparent border-none shadow-none text-xs font-bold text-ink-muted whitespace-nowrap">
                {uni.slug.toUpperCase()}
              </Tooltip>
              {isHovered && (
                <Popup autoPan={false} closeButton={false} className="custom-popup">
                  <div className="min-w-[220px] font-sans p-1">
                    <p className="font-bold text-sm text-ink leading-tight mb-1">{uni.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2 mt-2">
                      <Stars count={uni.prestige_stars} />
                      <LeagueBadge league={uni.league} />
                    </div>
                    <p className="text-xs text-ink-muted font-medium">{uni.city}, {uni.province}</p>
                    <p className="text-[10px] text-accent font-bold mt-2">CLICK TO OPEN →</p>
                  </div>
                </Popup>
              )}
            </Marker>
          )
        })}
      </MapContainer>
      
      {/* Add some global styles for leaflet tooltips/popups */}
      <style>{`
        .leaflet-tooltip.bg-transparent {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          text-shadow: 1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 4px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  )
}
