'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// INFRASTRUCTURE DATA — Morocco 2030
// =============================================================================

const STADIUMS = [
  { id: 'casablanca', name: 'Grand Stade de Casablanca', city: 'Casablanca', capacity: 115000, status: 'construction', completion: '2028', lat: 33.5731, lng: -7.5898 },
  { id: 'rabat', name: 'Complexe Moulay Abdellah', city: 'Rabat', capacity: 68000, status: 'renovation', completion: '2029', lat: 33.9716, lng: -6.8498 },
  { id: 'marrakech', name: 'Grand Stade de Marrakech', city: 'Marrakech', capacity: 68000, status: 'confirmed', completion: '2029', lat: 31.6295, lng: -7.9811 },
  { id: 'tangier', name: 'Grand Stade de Tanger', city: 'Tangier', capacity: 68000, status: 'expansion', completion: '2028', lat: 35.7595, lng: -5.8339 },
  { id: 'fes', name: 'Complexe Sportif de Fès', city: 'Fès', capacity: 50000, status: 'confirmed', completion: '2029', lat: 34.0181, lng: -5.0078 },
  { id: 'agadir', name: 'Stade d\'Agadir', city: 'Agadir', capacity: 50000, status: 'confirmed', completion: '2029', lat: 30.4278, lng: -9.5981 },
];

const TGV_LINES = [
  { id: 'lgv1', name: 'LGV Tanger-Casablanca', status: 'operational', length: 350, stations: ['Tanger', 'Kénitra', 'Rabat', 'Casablanca'] },
  { id: 'lgv2', name: 'LGV Casablanca-Marrakech', status: 'construction', length: 230, stations: ['Casablanca', 'Marrakech'], completion: '2029' },
  { id: 'lgv3', name: 'LGV Kénitra-Fès', status: 'planned', length: 180, stations: ['Kénitra', 'Meknès', 'Fès'], completion: '2030' },
];

const WATER = [
  { id: 'dessal1', name: 'Casablanca Desalination', type: 'desalination', capacity: '300M m³/year', status: 'construction' },
  { id: 'dam1', name: 'Mdez Dam', type: 'dam', capacity: '700M m³', status: 'operational' },
  { id: 'dam2', name: 'Kharroub Dam', type: 'dam', capacity: '180M m³', status: 'construction' },
];

const ENERGY = [
  { id: 'noor', name: 'Noor Solar Complex', type: 'solar', capacity: '580 MW', status: 'operational', location: 'Ouarzazate' },
  { id: 'tarfaya', name: 'Tarfaya Wind Farm', type: 'wind', capacity: '301 MW', status: 'operational', location: 'Tarfaya' },
  { id: 'midelt', name: 'Noor Midelt', type: 'hybrid', capacity: '800 MW', status: 'construction', location: 'Midelt' },
];

// =============================================================================
// LAYER TOGGLE COMPONENT
// =============================================================================

type LayerType = 'stadiums' | 'tgv' | 'water' | 'energy';

function LayerToggle({ 
  layer, 
  label, 
  count, 
  active, 
  color,
  onToggle 
}: { 
  layer: LayerType;
  label: string;
  count: number;
  active: boolean;
  color: string;
  onToggle: (layer: LayerType) => void;
}) {
  return (
    <button
      onClick={() => onToggle(layer)}
      className={`
        flex items-center gap-3 px-4 py-3 border transition-all duration-300
        ${active 
          ? 'bg-black text-white border-black' 
          : 'bg-white text-black border-gray-200 hover:border-black'
        }
      `}
    >
      <span 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: active ? color : '#ccc' }}
      />
      <span className="font-mono text-[10px] uppercase tracking-wider">
        {label}
      </span>
      <span className="font-mono text-[10px] opacity-50">
        {count}
      </span>
    </button>
  );
}

// =============================================================================
// DETAIL PANEL COMPONENT
// =============================================================================

function DetailPanel({ 
  type, 
  item, 
  onClose 
}: { 
  type: LayerType | null;
  item: any;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="absolute right-0 top-0 bottom-0 w-96 bg-white border-l border-black p-8 overflow-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 font-mono text-xs opacity-50 hover:opacity-100"
      >
        ✕
      </button>

      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
        {type}
      </p>

      <h3 className="font-serif text-2xl mt-2">
        {item.name}
      </h3>

      <div className="mt-6 space-y-4">
        {item.city && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Location</p>
            <p className="font-mono text-sm mt-1">{item.city}</p>
          </div>
        )}
        {item.capacity && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Capacity</p>
            <p className="font-mono text-2xl mt-1">
              {typeof item.capacity === 'number' 
                ? item.capacity.toLocaleString() 
                : item.capacity
              }
            </p>
          </div>
        )}
        {item.status && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Status</p>
            <p className="font-mono text-sm mt-1 flex items-center gap-2">
              <span 
                className={`w-2 h-2 rounded-full ${
                  item.status === 'operational' ? 'bg-black' :
                  item.status === 'construction' ? 'bg-[#ff4d00]' :
                  'bg-gray-400'
                }`}
              />
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </p>
          </div>
        )}
        {item.completion && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Completion</p>
            <p className="font-mono text-sm mt-1">{item.completion}</p>
          </div>
        )}
        {item.length && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Length</p>
            <p className="font-mono text-2xl mt-1">{item.length}<span className="text-sm">km</span></p>
          </div>
        )}
        {item.stations && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Stations</p>
            <p className="font-mono text-sm mt-1">{item.stations.join(' → ')}</p>
          </div>
        )}
      </div>

      {/* 2030 Proximity Score */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
          2030 Impact Score
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-mono text-4xl">94</span>
          <span className="font-mono text-sm text-gray-400 mb-1">/ 100</span>
        </div>
        <div className="mt-2 h-1 bg-gray-100">
          <div className="h-full bg-[#ff4d00]" style={{ width: '94%' }} />
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function InfrastructurePage() {
  const [activeLayers, setActiveLayers] = useState<Set<LayerType>>(
    new Set(['stadiums', 'tgv'])
  );
  const [selectedItem, setSelectedItem] = useState<{ type: LayerType; item: any } | null>(null);

  const toggleLayer = (layer: LayerType) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  };

  const selectItem = (type: LayerType, item: any) => {
    setSelectedItem({ type, item });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
            The Morocco Oracle
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/infrastructure" className="font-mono text-[10px] uppercase tracking-widest">
              Infrastructure
            </Link>
            <Link href="/heat" className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">
              Heat Map
            </Link>
            <Link href="/pipeline" className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">
              Pipeline
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="pt-20 px-6 py-12 border-b border-black">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400">
          2030 Readiness Index
        </p>
        <h1 className="font-serif text-5xl mt-2">
          The Skeleton of 2030
        </h1>
        <p className="font-mono text-sm text-gray-500 mt-4 max-w-xl">
          Stadiums, high-speed rail, water infrastructure, renewable energy. 
          Everything that must be built before 26 million visitors arrive.
        </p>
      </header>

      {/* Layer Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex gap-2 flex-wrap">
        <LayerToggle 
          layer="stadiums" 
          label="Stadiums" 
          count={STADIUMS.length}
          active={activeLayers.has('stadiums')}
          color="#ff4d00"
          onToggle={toggleLayer}
        />
        <LayerToggle 
          layer="tgv" 
          label="TGV Lines" 
          count={TGV_LINES.length}
          active={activeLayers.has('tgv')}
          color="#000000"
          onToggle={toggleLayer}
        />
        <LayerToggle 
          layer="water" 
          label="Water" 
          count={WATER.length}
          active={activeLayers.has('water')}
          color="#0066cc"
          onToggle={toggleLayer}
        />
        <LayerToggle 
          layer="energy" 
          label="Energy" 
          count={ENERGY.length}
          active={activeLayers.has('energy')}
          color="#ffcc00"
          onToggle={toggleLayer}
        />
      </div>

      {/* Main Content — Map + Lists */}
      <div className="flex" style={{ height: 'calc(100vh - 220px)' }}>
        
        {/* Map Area */}
        <div className="flex-1 bg-gray-900 relative">
          {/* Placeholder for Mapbox */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
                Interactive Map
              </p>
              <p className="font-mono text-[10px] text-white/30 mt-2">
                Mapbox integration pending
              </p>
            </div>
          </div>

          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#333" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Simulated markers */}
          {activeLayers.has('stadiums') && STADIUMS.map((stadium, i) => (
            <motion.button
              key={stadium.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => selectItem('stadiums', stadium)}
              className="absolute w-4 h-4 rounded-full bg-[#ff4d00] border-2 border-white hover:scale-150 transition-transform cursor-pointer"
              style={{
                top: `${20 + i * 12}%`,
                left: `${25 + i * 8}%`,
              }}
              title={stadium.name}
            />
          ))}

          {/* Detail Panel */}
          <AnimatePresence>
            {selectedItem && (
              <DetailPanel
                type={selectedItem.type}
                item={selectedItem.item}
                onClose={() => setSelectedItem(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Side List */}
        <div className="w-80 border-l border-black overflow-auto">
          
          {/* Stadiums List */}
          {activeLayers.has('stadiums') && (
            <div className="border-b border-gray-200">
              <div className="px-4 py-3 bg-gray-50">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  World Cup Stadiums
                </p>
              </div>
              {STADIUMS.map(stadium => (
                <button
                  key={stadium.id}
                  onClick={() => selectItem('stadiums', stadium)}
                  className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-mono text-xs">{stadium.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      stadium.status === 'operational' ? 'bg-black' :
                      stadium.status === 'construction' ? 'bg-[#ff4d00]' :
                      'bg-gray-400'
                    }`} />
                    <span className="font-mono text-[10px] text-gray-400">
                      {stadium.capacity.toLocaleString()} · {stadium.completion}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* TGV List */}
          {activeLayers.has('tgv') && (
            <div className="border-b border-gray-200">
              <div className="px-4 py-3 bg-gray-50">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  High-Speed Rail
                </p>
              </div>
              {TGV_LINES.map(line => (
                <button
                  key={line.id}
                  onClick={() => selectItem('tgv', line)}
                  className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-mono text-xs">{line.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      line.status === 'operational' ? 'bg-black' :
                      line.status === 'construction' ? 'bg-[#ff4d00]' :
                      'bg-gray-400'
                    }`} />
                    <span className="font-mono text-[10px] text-gray-400">
                      {line.length}km · {line.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Water List */}
          {activeLayers.has('water') && (
            <div className="border-b border-gray-200">
              <div className="px-4 py-3 bg-gray-50">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  Water Infrastructure
                </p>
              </div>
              {WATER.map(item => (
                <button
                  key={item.id}
                  onClick={() => selectItem('water', item)}
                  className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-mono text-xs">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#0066cc]`} />
                    <span className="font-mono text-[10px] text-gray-400">
                      {item.type} · {item.capacity}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Energy List */}
          {activeLayers.has('energy') && (
            <div>
              <div className="px-4 py-3 bg-gray-50">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  Renewable Energy
                </p>
              </div>
              {ENERGY.map(item => (
                <button
                  key={item.id}
                  onClick={() => selectItem('energy', item)}
                  className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-mono text-xs">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#ffcc00]`} />
                    <span className="font-mono text-[10px] text-gray-400">
                      {item.type} · {item.capacity}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
