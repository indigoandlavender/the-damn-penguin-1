'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// =============================================================================
// PIPELINE DATA — Hotel Developments
// =============================================================================

type DevelopmentStatus = 'confirmed' | 'construction' | 'planned' | 'rumored';

interface Development {
  id: string;
  name: string;
  brand?: string;
  city: string;
  region: string;
  keys: number;
  status: DevelopmentStatus;
  openingDate?: string;
  source: string;
  confidence: number; // 0-100
  notes?: string;
  lat: number;
  lng: number;
  addedAt: string;
}

const DEVELOPMENTS: Development[] = [
  {
    id: 'd1',
    name: 'Four Seasons Resort',
    brand: 'Four Seasons',
    city: 'Rabat',
    region: 'Rabat-Salé-Kénitra',
    keys: 200,
    status: 'construction',
    openingDate: 'Q1 2029',
    source: 'Company announcement',
    confidence: 95,
    lat: 34.0209,
    lng: -6.8416,
    addedAt: '2025-11-15',
  },
  {
    id: 'd2',
    name: 'Marriott Residence Inn',
    brand: 'Marriott',
    city: 'Tangier',
    region: 'Tanger-Tétouan',
    keys: 180,
    status: 'confirmed',
    openingDate: 'Q3 2028',
    source: 'Company announcement',
    confidence: 92,
    lat: 35.7595,
    lng: -5.8340,
    addedAt: '2025-10-22',
  },
  {
    id: 'd3',
    name: 'Mandarin Oriental',
    brand: 'Mandarin Oriental',
    city: 'Marrakech',
    region: 'Marrakech-Safi',
    keys: 150,
    status: 'construction',
    openingDate: 'Q2 2028',
    source: 'Company announcement',
    confidence: 98,
    lat: 31.6295,
    lng: -7.9811,
    addedAt: '2025-09-18',
  },
  {
    id: 'd4',
    name: 'W Hotel',
    brand: 'Marriott',
    city: 'Casablanca',
    region: 'Casablanca-Settat',
    keys: 220,
    status: 'planned',
    openingDate: 'Q4 2029',
    source: 'Industry sources',
    confidence: 78,
    lat: 33.5731,
    lng: -7.5898,
    addedAt: '2025-12-05',
  },
  {
    id: 'd5',
    name: 'Aman Resorts',
    brand: 'Aman',
    city: 'Dakhla',
    region: 'Dakhla-Oued Ed-Dahab',
    keys: 40,
    status: 'rumored',
    source: 'Industry chatter',
    confidence: 45,
    notes: 'Location undisclosed, Dakhla region suspected',
    lat: 23.6848,
    lng: -15.9579,
    addedAt: '2026-01-10',
  },
  {
    id: 'd6',
    name: 'Hilton Garden Inn',
    brand: 'Hilton',
    city: 'Agadir',
    region: 'Souss-Massa',
    keys: 160,
    status: 'confirmed',
    openingDate: 'Q2 2028',
    source: 'Company announcement',
    confidence: 90,
    lat: 30.4278,
    lng: -9.5981,
    addedAt: '2025-08-30',
  },
  {
    id: 'd7',
    name: 'Radisson Blu',
    brand: 'Radisson',
    city: 'Fès',
    region: 'Fès-Meknès',
    keys: 140,
    status: 'construction',
    openingDate: 'Q1 2028',
    source: 'Company announcement',
    confidence: 88,
    lat: 34.0333,
    lng: -5.0003,
    addedAt: '2025-07-14',
  },
  {
    id: 'd8',
    name: 'Rosewood',
    brand: 'Rosewood',
    city: 'Essaouira',
    region: 'Marrakech-Safi',
    keys: 80,
    status: 'planned',
    openingDate: 'Q3 2029',
    source: 'Permit filings',
    confidence: 72,
    lat: 31.5085,
    lng: -9.7595,
    addedAt: '2025-11-28',
  },
  {
    id: 'd9',
    name: 'Hyatt Regency',
    brand: 'Hyatt',
    city: 'Tangier',
    region: 'Tanger-Tétouan',
    keys: 250,
    status: 'construction',
    openingDate: 'Q4 2028',
    source: 'Company announcement',
    confidence: 94,
    lat: 35.7595,
    lng: -5.8340,
    addedAt: '2025-06-20',
  },
  {
    id: 'd10',
    name: 'Six Senses',
    brand: 'Six Senses',
    city: 'Taghazout',
    region: 'Souss-Massa',
    keys: 60,
    status: 'rumored',
    source: 'Industry chatter',
    confidence: 38,
    lat: 30.5456,
    lng: -9.7131,
    addedAt: '2026-01-05',
  },
  {
    id: 'd11',
    name: 'InterContinental',
    brand: 'IHG',
    city: 'Casablanca',
    region: 'Casablanca-Settat',
    keys: 300,
    status: 'confirmed',
    openingDate: 'Q1 2029',
    source: 'Company announcement',
    confidence: 91,
    lat: 33.5731,
    lng: -7.5898,
    addedAt: '2025-09-05',
  },
  {
    id: 'd12',
    name: 'Nobu Hotel',
    brand: 'Nobu',
    city: 'Marrakech',
    region: 'Marrakech-Safi',
    keys: 120,
    status: 'planned',
    openingDate: 'Q2 2029',
    source: 'Industry sources',
    confidence: 65,
    lat: 31.6295,
    lng: -7.9811,
    addedAt: '2025-12-12',
  },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function StatusBadge({ status }: { status: DevelopmentStatus }) {
  const styles: Record<DevelopmentStatus, { bg: string; color: string; border: string }> = {
    confirmed: { bg: 'transparent', color: 'var(--color-charcoal)', border: 'solid' },
    construction: { bg: 'transparent', color: 'var(--color-terracotta)', border: 'solid' },
    planned: { bg: 'transparent', color: 'var(--color-ash)', border: 'dashed' },
    rumored: { bg: 'transparent', color: 'var(--color-mist)', border: 'dotted' },
  };

  const style = styles[status];

  return (
    <span 
      className="text-xs font-medium uppercase tracking-wider px-3 py-1"
      style={{ 
        color: style.color,
        border: `1px ${style.border} currentColor`,
      }}
    >
      {status}
    </span>
  );
}

function DevelopmentCard({ development, size = 'normal' }: { development: Development; size?: 'normal' | 'large' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group transition-all duration-500 cursor-pointer"
      style={{
        backgroundColor: isHovered ? 'var(--color-charcoal)' : 'var(--color-paper)',
        color: isHovered ? 'var(--color-paper)' : 'var(--color-charcoal)',
        border: '1px solid var(--color-stone)',
        padding: size === 'large' ? '2.5rem' : '2rem',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p 
          className="text-xs font-medium uppercase tracking-widest"
          style={{ 
            color: isHovered ? 'var(--color-stone)' : 'var(--color-ash)',
            transition: 'color 500ms ease',
          }}
        >
          {development.brand || 'Independent'}
        </p>
        <StatusBadge status={development.status} />
      </div>

      {/* Name */}
      <h3 
        className={`font-serif font-light mb-2 ${size === 'large' ? 'text-3xl' : 'text-2xl'}`}
        style={{ lineHeight: 1.2 }}
      >
        {development.name}
      </h3>

      {/* Location */}
      <p 
        className="font-serif italic mb-6"
        style={{ 
          color: isHovered ? 'var(--color-stone)' : 'var(--color-graphite)',
          transition: 'color 500ms ease',
        }}
      >
        {development.city}
      </p>

      {/* Divider */}
      <div 
        className="h-px w-full mb-6"
        style={{ 
          backgroundColor: isHovered ? 'var(--color-graphite)' : 'var(--color-stone)',
          transition: 'background-color 500ms ease',
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p 
            className="text-xs font-medium uppercase tracking-widest mb-1"
            style={{ 
              color: isHovered ? 'var(--color-ash)' : 'var(--color-ash)',
            }}
          >
            Keys
          </p>
          <p className={`font-serif font-light ${size === 'large' ? 'text-3xl' : 'text-2xl'}`}>
            {development.keys}
          </p>
        </div>
        {development.openingDate && (
          <div>
            <p 
              className="text-xs font-medium uppercase tracking-widest mb-1"
              style={{ 
                color: isHovered ? 'var(--color-ash)' : 'var(--color-ash)',
              }}
            >
              Opening
            </p>
            <p className={`font-serif font-light ${size === 'large' ? 'text-xl' : 'text-lg'}`}>
              {development.openingDate}
            </p>
          </div>
        )}
      </div>

      {/* Confidence */}
      <div>
        <p 
          className="text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: isHovered ? 'var(--color-ash)' : 'var(--color-ash)' }}
        >
          Confidence
        </p>
        <div className="flex items-center gap-3">
          <div 
            className="flex-1 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: isHovered ? 'var(--color-graphite)' : 'var(--color-stone)' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${development.confidence}%`,
                backgroundColor: isHovered ? 'var(--color-paper)' : 'var(--color-terracotta)',
              }}
            />
          </div>
          <span className="font-mono text-xs">
            {development.confidence}%
          </span>
        </div>
      </div>

      {/* Notes (if any) */}
      {development.notes && (
        <p 
          className="mt-4 text-xs italic"
          style={{ 
            color: isHovered ? 'var(--color-ash)' : 'var(--color-ash)',
          }}
        >
          {development.notes}
        </p>
      )}

      {/* Source */}
      <p 
        className="mt-4 text-xs"
        style={{ 
          color: isHovered ? 'var(--color-ash)' : 'var(--color-mist)',
        }}
      >
        Source: {development.source}
      </p>
    </article>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function PipelinePage() {
  const [statusFilter, setStatusFilter] = useState<DevelopmentStatus | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const regions = useMemo(() => {
    const unique = [...new Set(DEVELOPMENTS.map(d => d.region))];
    return ['all', ...unique.sort()];
  }, []);

  const filteredDevelopments = useMemo(() => {
    return DEVELOPMENTS
      .filter(d => statusFilter === 'all' || d.status === statusFilter)
      .filter(d => regionFilter === 'all' || d.region === regionFilter)
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  }, [statusFilter, regionFilter]);

  const totalKeys = useMemo(() => {
    return filteredDevelopments.reduce((sum, d) => sum + d.keys, 0);
  }, [filteredDevelopments]);

  const statusCounts = useMemo(() => {
    return {
      confirmed: DEVELOPMENTS.filter(d => d.status === 'confirmed').length,
      construction: DEVELOPMENTS.filter(d => d.status === 'construction').length,
      planned: DEVELOPMENTS.filter(d => d.status === 'planned').length,
      rumored: DEVELOPMENTS.filter(d => d.status === 'rumored').length,
    };
  }, []);

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
          <Link 
            href="/heat" 
            className="link-underline text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-graphite)' }}
          >
            Heat
          </Link>
          <span 
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-terracotta)' }}
          >
            Pipeline
          </span>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--color-ash)' }}>
            What&apos;s Coming
          </p>
          <h1 className="font-serif text-6xl font-light mb-4" style={{ color: 'var(--color-charcoal)' }}>
            Development Pipeline
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--color-graphite)', lineHeight: 1.7 }}>
            Hotel projects across Morocco. Confirmed, under construction, planned, and rumored. 
            Track every major development heading into 2030.
          </p>
        </div>
      </header>

      {/* Stats Bar */}
      <section 
        className="py-8 px-8"
        style={{ backgroundColor: 'var(--color-cream)' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
              Total Projects
            </p>
            <p className="font-serif text-4xl font-light">{filteredDevelopments.length}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
              Total Keys
            </p>
            <p className="font-serif text-4xl font-light">{totalKeys.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
              Confirmed
            </p>
            <p className="font-serif text-4xl font-light">{statusCounts.confirmed}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
              Under Construction
            </p>
            <p className="font-serif text-4xl font-light" style={{ color: 'var(--color-terracotta)' }}>
              {statusCounts.construction}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-ash)' }}>
              Rumored
            </p>
            <p className="font-serif text-4xl font-light" style={{ color: 'var(--color-mist)' }}>
              {statusCounts.rumored}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-8" style={{ borderBottom: '1px solid var(--color-stone)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap gap-8">
          {/* Status Filter */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--color-ash)' }}>
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {(['all', 'confirmed', 'construction', 'planned', 'rumored'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300"
                  style={{
                    backgroundColor: statusFilter === status ? 'var(--color-charcoal)' : 'transparent',
                    color: statusFilter === status ? 'var(--color-paper)' : 'var(--color-graphite)',
                    border: `1px solid ${statusFilter === status ? 'var(--color-charcoal)' : 'var(--color-stone)'}`,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--color-ash)' }}>
              Region
            </p>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-4 py-2 text-sm bg-transparent"
              style={{
                border: '1px solid var(--color-stone)',
                color: 'var(--color-charcoal)',
              }}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Gallery Grid — Masonry style */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {filteredDevelopments.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-sm" style={{ color: 'var(--color-ash)' }}>
                No developments match your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevelopments.map((development, index) => (
                <DevelopmentCard 
                  key={development.id} 
                  development={development}
                  size={index === 0 ? 'large' : 'normal'}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-16 px-8"
        style={{ backgroundColor: 'var(--color-charcoal)', color: 'var(--color-stone)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-serif text-xl italic" style={{ color: 'var(--color-paper)' }}>
              The Damn Penguin
            </p>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">
              Walking to the mountains
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest opacity-50">
              © 2026 · National Investment Intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
