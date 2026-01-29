'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CinematicMap, type CinematicMapHandle, type LandParcel } from '@/components/cinematic-map';
import type { LegalStatus, CityClassification, Property } from '@/types';

// =============================================================================
// DATA
// =============================================================================

const mockProperties: Property[] = [
  {
    id: '1',
    title_number: 'TF-12847/M',
    requisition_number: null,
    melkia_reference: null,
    legal_status: 'Titled',
    legal_confidence_score: 94,
    cadastre_status: 'OK',
    heirs_status: 'OK',
    encumbrance_status: 'OK',
    occupation_status: 'OK',
    gps_point: { type: 'Point', coordinates: [-7.9811, 31.6295] },
    boundary_polygon: null,
    cadastral_zone: 'MR-2847-014',
    region: 'Marrakech-Safi',
    city: 'Marrakech',
    neighborhood: 'Médina',
    street_address: null,
    charter_category: 'A',
    charter_score: 82,
    charter_eligible: true,
    estimated_cashback_pct: 10,
    acquisition_price_mad: 5100000,
    estimated_value_mad: 5100000,
    price_per_sqm_mad: 12750,
    surface_sqm: 400,
    net_acquisition_cost_mad: 4590000,
    property_type: 'Riad',
    construction_year: 1890,
    rooms: 7,
    floors: 2,
    audit_trail: [],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    created_by: null,
    updated_by: null,
  },
  {
    id: '2',
    title_number: null,
    requisition_number: 'REQ-2024-4521',
    melkia_reference: null,
    legal_status: 'In-Process',
    legal_confidence_score: 67,
    cadastre_status: 'OK',
    heirs_status: 'PENDING',
    encumbrance_status: 'OK',
    occupation_status: 'OK',
    gps_point: { type: 'Point', coordinates: [-9.7668, 31.5085] },
    boundary_polygon: null,
    cadastral_zone: 'ES-1247-008',
    region: 'Marrakech-Safi',
    city: 'Essaouira',
    neighborhood: 'Médina',
    street_address: null,
    charter_category: 'B',
    charter_score: 71,
    charter_eligible: true,
    estimated_cashback_pct: 15,
    acquisition_price_mad: 3200000,
    estimated_value_mad: 3200000,
    price_per_sqm_mad: 9142,
    surface_sqm: 350,
    net_acquisition_cost_mad: 2720000,
    property_type: 'Dar',
    construction_year: 1920,
    rooms: 5,
    floors: 2,
    audit_trail: [],
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-02-15T11:20:00Z',
    created_by: null,
    updated_by: null,
  },
  {
    id: '3',
    title_number: 'TF-5521/F',
    requisition_number: null,
    melkia_reference: null,
    legal_status: 'Titled',
    legal_confidence_score: 91,
    cadastre_status: 'OK',
    heirs_status: 'OK',
    encumbrance_status: 'OK',
    occupation_status: 'OK',
    gps_point: { type: 'Point', coordinates: [-5.0003, 34.0333] },
    boundary_polygon: null,
    cadastral_zone: 'FS-5521-012',
    region: 'Fes-Meknes',
    city: 'Fes',
    neighborhood: 'Fes el-Bali',
    street_address: null,
    charter_category: 'B',
    charter_score: 78,
    charter_eligible: true,
    estimated_cashback_pct: 15,
    acquisition_price_mad: 3800000,
    estimated_value_mad: 3800000,
    price_per_sqm_mad: 7916,
    surface_sqm: 480,
    net_acquisition_cost_mad: 3230000,
    property_type: 'Riad',
    construction_year: 1850,
    rooms: 9,
    floors: 2,
    audit_trail: [],
    created_at: '2024-03-01T08:00:00Z',
    updated_at: '2024-03-05T16:45:00Z',
    created_by: null,
    updated_by: null,
  },
  {
    id: '4',
    title_number: null,
    requisition_number: null,
    melkia_reference: 'MLK-OZ-7842',
    legal_status: 'Melkia',
    legal_confidence_score: 34,
    cadastre_status: 'PENDING',
    heirs_status: 'PENDING',
    encumbrance_status: 'FAILED',
    occupation_status: 'OK',
    gps_point: { type: 'Point', coordinates: [-6.8936, 30.9189] },
    boundary_polygon: null,
    cadastral_zone: 'OZ-7842-021',
    region: 'Draa-Tafilalet',
    city: 'Ouarzazate',
    neighborhood: 'Kasbah Taourirt',
    street_address: null,
    charter_category: 'C',
    charter_score: 45,
    charter_eligible: true,
    estimated_cashback_pct: 20,
    acquisition_price_mad: 1400000,
    estimated_value_mad: 1400000,
    price_per_sqm_mad: 4000,
    surface_sqm: 350,
    net_acquisition_cost_mad: 1120000,
    property_type: 'Kasbah',
    construction_year: 1780,
    rooms: 12,
    floors: 3,
    audit_trail: [],
    created_at: '2024-03-10T08:00:00Z',
    updated_at: '2024-03-15T16:45:00Z',
    created_by: null,
    updated_by: null,
  },
];

const mockParcels: LandParcel[] = mockProperties.map((p) => ({
  id: `parcel-${p.id}`,
  property_id: p.id,
  polygon: {
    type: 'Polygon' as const,
    coordinates: p.gps_point
      ? [[
          [p.gps_point.coordinates[0] - 0.0004, p.gps_point.coordinates[1] + 0.0005],
          [p.gps_point.coordinates[0] + 0.0004, p.gps_point.coordinates[1] + 0.0005],
          [p.gps_point.coordinates[0] + 0.0004, p.gps_point.coordinates[1] - 0.0005],
          [p.gps_point.coordinates[0] - 0.0004, p.gps_point.coordinates[1] - 0.0005],
          [p.gps_point.coordinates[0] - 0.0004, p.gps_point.coordinates[1] + 0.0005],
        ]]
      : [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]],
  },
  legal_status: p.legal_status,
  title_number: p.title_number ?? undefined,
  estimated_value_mad: p.estimated_value_mad ?? undefined,
}));

function formatMAD(value: number): string {
  return new Intl.NumberFormat('fr-MA').format(value);
}

// =============================================================================
// PAGE
// =============================================================================

export default function DashboardPage() {
  const mapRef = useRef<CinematicMapHandle>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const portfolioValue = mockProperties.reduce((sum, p) => sum + (p.estimated_value_mad || 0), 0);
  const totalNetCost = mockProperties.reduce((sum, p) => sum + (p.net_acquisition_cost_mad || 0), 0);

  const handlePropertyHover = useCallback((property: Property) => {
    setSelectedProperty(property);
    if (property.gps_point && mapRef.current) {
      mapRef.current.flyToProperty({
        lng: property.gps_point.coordinates[0],
        lat: property.gps_point.coordinates[1],
      }, 14);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Navigation */}
      <nav className="px-8 py-6 flex items-center justify-between">
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.02em]">
          The Morocco Oracle
        </Link>
        <div className="flex items-center gap-10">
          <Link href="/infrastructure" className="text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors">
            Infrastructure
          </Link>
          <Link href="/heat" className="text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors">
            Heat Map
          </Link>
          <Link href="/pipeline" className="text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors">
            Pipeline
          </Link>
          <Link href="/dashboard" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-500 transition-colors">
            Portfolio
          </Link>
        </div>
      </nav>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Header */}
      <header className="px-8 py-12">
        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
          Investment Portfolio
        </p>
        <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.85] tracking-[-0.03em] mt-4">
          PROPERTY
          <br />
          INTELLIGENCE
        </h1>
      </header>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Stats — Large, editorial */}
      <section className="px-8 py-16 grid grid-cols-2 gap-16">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            Portfolio Value
          </p>
          <p className="text-[3.5rem] font-bold tracking-[-0.03em] mt-2 leading-none">
            {formatMAD(portfolioValue)}
            <span className="text-[1rem] text-gray-400 ml-2">MAD</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            Net Acquisition
          </p>
          <p className="text-[3.5rem] font-bold tracking-[-0.03em] mt-2 leading-none">
            {formatMAD(totalNetCost)}
            <span className="text-[1rem] text-gray-400 ml-2">MAD</span>
          </p>
        </div>
      </section>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Properties count */}
      <div className="px-8 py-6">
        <p className="text-[11px] uppercase tracking-[0.15em]">
          {mockProperties.length} Properties
        </p>
      </div>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Property List — Editorial style */}
      <section>
        {mockProperties.map((property, index) => (
          <Link 
            key={property.id} 
            href={`/refinery/${property.id}`}
            className="block group"
            onMouseEnter={() => handlePropertyHover(property)}
          >
            <article className="px-8 py-12 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-8 items-start">
                
                {/* Index */}
                <div className="col-span-1">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                </div>

                {/* Main info */}
                <div className="col-span-5">
                  <h2 className="text-[2rem] font-bold tracking-[-0.02em] leading-tight group-hover:text-gray-500 transition-colors">
                    {property.city}
                  </h2>
                  <p className="text-[13px] text-gray-500 mt-2">
                    {property.neighborhood} · {property.property_type}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 mt-4">
                    {property.title_number || property.requisition_number || property.melkia_reference}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
                    Status
                  </p>
                  <p className="text-[13px] mt-2">
                    {property.legal_status}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-16 h-1 bg-gray-200">
                      <div 
                        className="h-full bg-black"
                        style={{ width: `${property.legal_confidence_score}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {property.legal_confidence_score}%
                    </span>
                  </div>
                </div>

                {/* Value */}
                <div className="col-span-2">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
                    Value
                  </p>
                  <p className="text-[1.25rem] font-bold tracking-[-0.02em] mt-2">
                    {formatMAD(property.estimated_value_mad || 0)}
                  </p>
                  <p className="text-[11px] text-gray-400">MAD</p>
                </div>

                {/* Net */}
                <div className="col-span-2 text-right">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
                    Net Acquisition
                  </p>
                  <p className="text-[1.25rem] font-bold tracking-[-0.02em] mt-2">
                    {formatMAD(property.net_acquisition_cost_mad || 0)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    -{property.estimated_cashback_pct}% charter
                  </p>
                </div>
              </div>
            </article>

            {/* Thin rule */}
            <div className="mx-8 h-px bg-gray-200" />
          </Link>
        ))}
      </section>

      {/* Map section */}
      <section className="mt-16">
        <div className="px-8 py-6">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            Geographic Distribution
          </p>
        </div>
        <div className="h-[70vh] bg-gray-100">
          <CinematicMap
            ref={mapRef}
            height="100%"
            showCrosshair={false}
            parcels={mockParcels}
            enableRealtime={false}
            onParcelClick={(parcel) => {
              window.location.href = `/refinery/${parcel.property_id}`;
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 flex items-center justify-between border-t border-gray-200 mt-16">
        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
          © 2026 The Morocco Oracle
        </p>
        <button
          onClick={async () => {
            await fetch('/api/auth', { method: 'DELETE' });
            window.location.href = '/login';
          }}
          className="text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors"
        >
          Sign Out
        </button>
      </footer>
    </div>
  );
}
