'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// =============================================================================
// PAGE
// =============================================================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Navigation — Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
            The Morocco Oracle
          </Link>
          <div className="flex items-center gap-8">
            <Link 
              href="/infrastructure" 
              className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              Infrastructure
            </Link>
            <Link 
              href="/heat" 
              className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              Heat Map
            </Link>
            <Link 
              href="/pipeline" 
              className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              Pipeline
            </Link>
            <Link 
              href="/dashboard" 
              className="font-mono text-[10px] uppercase tracking-widest bg-black text-white px-4 py-2 hover:bg-white hover:text-black border border-black transition-all"
            >
              Enter
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Full viewport map with overlaid title */}
      <section className="relative h-screen">
        
        {/* Map Background — Dark */}
        <div className="absolute inset-0 bg-gray-900">
          {/* Placeholder for Mapbox - will be replaced with actual map */}
          <div className="absolute inset-0 opacity-60">
            {/* Grid pattern overlay */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#333" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Simulated hotspots — will be real data */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[35%] left-[30%] w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,77,0,0.4) 0%, rgba(255,77,0,0) 70%)'
            }}
          />
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[45%] left-[55%] w-24 h-24 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,77,0,0.3) 0%, rgba(255,77,0,0) 70%)'
            }}
          />
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[25%] left-[65%] w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,77,0,0.25) 0%, rgba(255,77,0,0) 70%)'
            }}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 pt-20">
          
          {/* Top — Micro label */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
              National Investment Intelligence · 2030 World Cup
            </p>
          </motion.div>

          {/* Center — Title */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.h1 
              variants={fadeInUp}
              className="font-serif text-[clamp(3rem,10vw,8rem)] font-light leading-[0.9] text-white"
            >
              The Morocco
              <br />
              <span className="text-[#ff4d00]">Oracle</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="mt-8 font-mono text-sm text-white/60 max-w-md leading-relaxed"
            >
              Sovereign data infrastructure for the 2030 economic transformation. 
              Infrastructure. Heat maps. Development pipeline. Real-time intelligence.
            </motion.p>
          </motion.div>

          {/* Bottom — Stats bar */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex items-end justify-between"
          >
            {/* Stats */}
            <div className="flex gap-16">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  2030 Readiness
                </p>
                <p className="font-mono text-4xl text-white mt-1">
                  87<span className="text-[#ff4d00]">%</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Active Projects
                </p>
                <p className="font-mono text-4xl text-white mt-1">
                  247
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Capital Deployed
                </p>
                <p className="font-mono text-4xl text-white mt-1">
                  €4.2<span className="text-lg">B</span>
                </p>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                Explore
              </p>
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section — Entry Points */}
      <section className="border-t border-black">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          
          {/* Infrastructure */}
          <Link 
            href="/infrastructure"
            className="group border-b lg:border-b-0 lg:border-r border-black p-12 hover:bg-black hover:text-white transition-colors duration-500"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-60">
              01
            </p>
            <h2 className="font-serif text-3xl mt-4">
              Infrastructure
            </h2>
            <p className="font-mono text-xs mt-4 opacity-60 leading-relaxed">
              The skeleton of 2030. Stadiums, TGV lines, water systems, solar farms. 
              Everything that must be built before the world arrives.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff4d00]" />
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                6 Stadiums · 1,300km TGV · 12 Dams
              </span>
            </div>
          </Link>

          {/* Heat Map */}
          <Link 
            href="/heat"
            className="group border-b lg:border-b-0 lg:border-r border-black p-12 hover:bg-black hover:text-white transition-colors duration-500"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-60">
              02
            </p>
            <h2 className="font-serif text-3xl mt-4">
              Heat Map
            </h2>
            <p className="font-mono text-xs mt-4 opacity-60 leading-relaxed">
              Where capital flows. Transaction volume, price appreciation, 
              foreign buyer concentration. See the money move before it moves.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff4d00]" />
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                Updated Daily · 12 Regions
              </span>
            </div>
          </Link>

          {/* Pipeline */}
          <Link 
            href="/pipeline"
            className="group p-12 hover:bg-black hover:text-white transition-colors duration-500"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-60">
              03
            </p>
            <h2 className="font-serif text-3xl mt-4">
              Pipeline
            </h2>
            <p className="font-mono text-xs mt-4 opacity-60 leading-relaxed">
              Every hotel, resort, and development project. 
              Confirmed, under construction, rumored. The future, tracked.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff4d00]" />
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                247 Projects · €4.2B Value
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Section — The Oracle Promise */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            The Data Layer
          </p>
          <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] font-light mt-6 leading-tight">
            We don't sell reports.
            <br />
            <span className="text-[#ff4d00]">We sell the truth.</span>
          </h2>
          <p className="font-mono text-sm text-white/50 mt-8 max-w-xl mx-auto leading-relaxed">
            Every data point verified. Every project tracked. Every transaction recorded. 
            The only sovereign intelligence infrastructure for Morocco's 2030 transformation.
          </p>
          <Link 
            href="/api"
            className="inline-block mt-12 font-mono text-[11px] uppercase tracking-widest border border-white/30 px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
          >
            API Access →
          </Link>
        </div>
      </section>

      {/* Footer — Minimal */}
      <footer className="border-t border-black px-6 py-8">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">
            © 2026 The Morocco Oracle
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">
            Institutional Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
