'use client';

import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// =============================================================================
// HEAT DATA — Investment Flow by Region
// =============================================================================

interface HeatZone {
  id: string;
  region: string;
  city: string;
  lat: number;
  lng: number;
  heat: number; // 0-1
  transactions30d: number;
  avgPriceChange: number; // percentage YoY
  foreignBuyerPct: number;
  avgPricePerSqm: number;
}

const HEAT_ZONES: HeatZone[] = [
  { id: 'h1', region: 'Marrakech-Safi', city: 'Marrakech', lat: 31.6295, lng: -7.9811, heat: 0.95, transactions30d: 847, avgPriceChange: 18.5, foreignBuyerPct: 42, avgPricePerSqm: 24000 },
  { id: 'h2', region: 'Tanger-Tetouan', city: 'Tangier', lat: 35.7595, lng: -5.8340, heat: 0.88, transactions30d: 623, avgPriceChange: 28.2, foreignBuyerPct: 38, avgPricePerSqm: 18500 },
  { id: 'h3', region: 'Casablanca-Settat', city: 'Casablanca', lat: 33.5731, lng: -7.5898, heat: 0.82, transactions30d: 1240, avgPriceChange: 12.1, foreignBuyerPct: 25, avgPricePerSqm: 28000 },
  { id: 'h4', region: 'Souss-Massa', city: 'Agadir', lat: 30.4278, lng: -9.5981, heat: 0.75, transactions30d: 412, avgPriceChange: 22.8, foreignBuyerPct: 35, avgPricePerSqm: 15000 },
  { id: 'h5', region: 'Fès-Meknès', city: 'Fès', lat: 34.0333, lng: -5.0003, heat: 0.68, transactions30d: 298, avgPriceChange: 15.3, foreignBuyerPct: 28, avgPricePerSqm: 12000 },
  { id: 'h6', region: 'Marrakech-Safi', city: 'Essaouira', lat: 31.5085, lng: -9.7595, heat: 0.72, transactions30d: 187, avgPriceChange: 24.5, foreignBuyerPct: 52, avgPricePerSqm: 16500 },
  { id: 'h7', region: 'Rabat-Salé-Kénitra', city: 'Rabat', lat: 34.0209, lng: -6.8416, heat: 0.65, transactions30d: 534, avgPriceChange: 8.7, foreignBuyerPct: 18, avgPricePerSqm: 22000 },
  { id: 'h8', region: 'Dakhla-Oued Ed-Dahab', city: 'Dakhla', lat: 23.6848, lng: -15.9579, heat: 0.58, transactions30d: 89, avgPriceChange: 45.2, foreignBuyerPct: 62, avgPricePerSqm: 8000 },
  { id: 'h9', region: 'Draa-Tafilalet', city: 'Ouarzazate', lat: 30.9189, lng: -6.8936, heat: 0.52, transactions30d: 67, avgPriceChange: 19.8, foreignBuyerPct: 45, avgPricePerSqm: 6500 },
  { id: 'h10', region: 'Oriental', city: 'Oujda', lat: 34.6805, lng: -1.9076, heat: 0.38, transactions30d: 112, avgPriceChange: 5.2, foreignBuyerPct: 8, avgPricePerSqm: 9000 },
];

type FilterType = 'all' | 'hotels' | 'riads' | 'land' | 'villas';
type TimeRange = '30d' | '90d' | '1y';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getHeatColor(heat: number): string {
  // Warm gradient: cream → blush → terracotta
  if (heat < 0.3) return 'rgba(245, 243, 239, 0.6)';
  if (heat < 0.5) return 'rgba(232, 213, 196, 0.7)';
  if (heat < 0.7) return 'rgba(212, 165, 116, 0.75)';
  if (heat < 0.85) return 'rgba(196, 120, 90, 0.8)';
  return 'rgba(168, 93, 66, 0.85)';
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

function formatMAD(num: number): string {
  return new Intl.NumberFormat('fr-MA').format(num);
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function HeatMapPage() {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: -6.5,
    latitude: 32,
    zoom: 5.5,
    pitch: 0,
    bearing: 0,
  });

  const [selectedZone, setSelectedZone] = useState<HeatZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<HeatZone | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<FilterType>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Generate GeoJSON for heat circles
  const heatGeoJSON = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: HEAT_ZONES.map(zone => ({
      type: 'Feature' as const,
      properties: {
        id: zone.id,
        heat: zone.heat,
        city: zone.city,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [zone.lng, zone.lat],
      },
    })),
  }), []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-paper)' }}>
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
        style={{ backgroundColor: 'rgba(250, 249, 247, 0.95)', backdropFilter: 'blur(8px)' }}
      >
        <Link 
          href="/" 
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-charcoal)' }}
        >
          The Morocco Oracle
        </Link>
        <div className="flex items-center gap-10">
          <Link 
            href="/infrastructure" 
            className="link-underline text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-graphite)' }}
          >
            Infrastructure
          </Link>
          <span 
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-terracotta)' }}
          >
            Heat
          </span>
          <Link 
            href="/pipeline" 
            className="link-underline text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-graphite)' }}
          >
            Pipeline
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 h-screen flex">
        {/* Left Panel — Filters & Rankings */}
        <div 
          className="w-96 h-full p-8 flex flex-col overflow-y-auto"
          style={{ borderRight: '1px solid var(--color-stone)' }}
        >
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--color-ash)' }}>
              Where Money Flows
            </p>
            <h1 className="font-serif text-4xl font-light" style={{ color: 'var(--color-charcoal)' }}>
              Heat Map
            </h1>
          </div>

          <p className="text-sm mb-8" style={{ color: 'var(--color-graphite)', lineHeight: 1.7 }}>
            Investment intensity by region. Transaction volume, price appreciation, 
            and foreign buyer concentration.
          </p>

          {/* Filters */}
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--color-ash)' }}>
              Property Type
            </p>
            <div className="flex flex-wrap gap-2">
              {(['all', 'hotels', 'riads', 'land', 'villas'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPropertyFilter(filter)}
                  className="px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300"
                  style={{
                    backgroundColor: propertyFilter === filter ? 'var(--color-charcoal)' : 'transparent',
                    color: propertyFilter === filter ? 'var(--color-paper)' : 'var(--color-graphite)',
                    border: `1px solid ${propertyFilter === filter ? 'var(--color-charcoal)' : 'var(--color-stone)'}`,
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--color-ash)' }}>
              Time Range
            </p>
            <div className="flex gap-2">
              {(['30d', '90d', '1y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className="px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300"
                  style={{
                    backgroundColor: timeRange === range ? 'var(--color-charcoal)' : 'transparent',
                    color: timeRange === range ? 'var(--color-paper)' : 'var(--color-graphite)',
                    border: `1px solid ${timeRange === range ? 'var(--color-charcoal)' : 'var(--color-stone)'}`,
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Heat Rankings */}
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--color-ash)' }}>
              Rankings
            </p>
            <div className="space-y-1">
              {[...HEAT_ZONES].sort((a, b) => b.heat - a.heat).map((zone, index) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone);
                    mapRef.current?.flyTo({
                      center: [zone.lng, zone.lat],
                      zoom: 9,
                      duration: 1500,
                    });
                  }}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="w-full flex items-center justify-between p-3 transition-all duration-200"
                  style={{
                    backgroundColor: selectedZone?.id === zone.id ? 'var(--color-cream)' : 
                                    hoveredZone?.id === zone.id ? 'var(--color-cream)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="font-mono text-xs w-5"
                      style={{ color: 'var(--color-ash)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--color-charcoal)' }}>
                      {zone.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-16 h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--color-stone)' }}
                    >
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${zone.heat * 100}%`,
                          backgroundColor: 'var(--color-terracotta)',
                        }}
                      />
                    </div>
                    <span 
                      className="font-mono text-xs w-8 text-right"
                      style={{ color: 'var(--color-graphite)' }}
                    >
                      {Math.round(zone.heat * 100)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Legend */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-stone)' }}>
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--color-ash)' }}>
              Heat Scale
            </p>
            <div 
              className="h-3 rounded-full"
              style={{
                background: 'linear-gradient(to right, rgba(245, 243, 239, 0.8) 0%, rgba(232, 213, 196, 0.8) 25%, rgba(212, 165, 116, 0.8) 50%, rgba(196, 120, 90, 0.85) 75%, rgba(168, 93, 66, 0.9) 100%)',
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: 'var(--color-ash)' }}>Cool</span>
              <span className="text-xs" style={{ color: 'var(--color-ash)' }}>Hot</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}
            style={{ width: '100%', height: '100%' }}
            attributionControl={false}
          >
            {/* Heat circles */}
            <Source id="heat-zones" type="geojson" data={heatGeoJSON}>
              <Layer
                id="heat-circles"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'heat'],
                    0.3, 30,
                    0.5, 50,
                    0.7, 70,
                    1, 100,
                  ],
                  'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'heat'],
                    0.3, 'rgba(245, 243, 239, 0.5)',
                    0.5, 'rgba(232, 213, 196, 0.6)',
                    0.7, 'rgba(212, 165, 116, 0.65)',
                    0.85, 'rgba(196, 120, 90, 0.7)',
                    1, 'rgba(168, 93, 66, 0.75)',
                  ],
                  'circle-blur': 0.5,
                }}
              />
            </Source>

            {/* City labels */}
            {HEAT_ZONES.map((zone) => (
              <Popup
                key={`label-${zone.id}`}
                longitude={zone.lng}
                latitude={zone.lat}
                anchor="center"
                closeButton={false}
                closeOnClick={false}
                className="heat-label-popup"
              >
                <span 
                  className="text-xs font-medium uppercase tracking-wide cursor-pointer"
                  style={{ color: 'var(--color-charcoal)' }}
                  onClick={() => {
                    setSelectedZone(zone);
                    mapRef.current?.flyTo({
                      center: [zone.lng, zone.lat],
                      zoom: 9,
                      duration: 1500,
                    });
                  }}
                >
                  {zone.city}
                </span>
              </Popup>
            ))}
          </Map>

          {/* Selected Zone Detail */}
          {selectedZone && (
            <div 
              className="absolute right-0 top-0 bottom-0 w-80 z-20 p-8 overflow-y-auto"
              style={{ 
                backgroundColor: 'var(--color-paper)', 
                borderLeft: '1px solid var(--color-stone)' 
              }}
            >
              <button 
                onClick={() => setSelectedZone(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center"
                style={{ color: 'var(--color-ash)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--color-ash)' }}>
                {selectedZone.region}
              </p>
              <h2 className="font-serif text-3xl font-light mb-6" style={{ color: 'var(--color-charcoal)' }}>
                {selectedZone.city}
              </h2>

              <div className="h-px w-full mb-6" style={{ backgroundColor: 'var(--color-stone)' }} />

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
                    Heat Index
                  </p>
                  <p className="font-serif text-5xl font-light" style={{ color: 'var(--color-terracotta)' }}>
                    {Math.round(selectedZone.heat * 100)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
                    Transactions (30d)
                  </p>
                  <p className="font-serif text-3xl font-light">
                    {selectedZone.transactions30d}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
                    Price Change (YoY)
                  </p>
                  <p 
                    className="font-serif text-3xl font-light"
                    style={{ color: selectedZone.avgPriceChange > 20 ? 'var(--color-terracotta)' : 'var(--color-charcoal)' }}
                  >
                    +{selectedZone.avgPriceChange}%
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
                    Foreign Buyers
                  </p>
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--color-stone)' }}
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${selectedZone.foreignBuyerPct}%`,
                          backgroundColor: 'var(--color-charcoal)',
                        }}
                      />
                    </div>
                    <span className="font-mono text-sm">
                      {selectedZone.foreignBuyerPct}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
                    Avg. Price/m²
                  </p>
                  <p className="font-serif text-2xl font-light">
                    {formatMAD(selectedZone.avgPricePerSqm)} <span className="text-base">MAD</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
