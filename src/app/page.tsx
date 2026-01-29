'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Navigation — Simple text, no buttons */}
      <nav className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-[11px] uppercase tracking-[0.15em]">English</span>
          <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400">Français</span>
        </div>
        <div className="flex items-center gap-10">
          <Link href="/infrastructure" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-500 transition-colors">
            Infrastructure
          </Link>
          <Link href="/heat" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-500 transition-colors">
            Heat Map
          </Link>
          <Link href="/pipeline" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-500 transition-colors">
            Pipeline
          </Link>
          <Link href="/dashboard" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-500 transition-colors">
            Portfolio
          </Link>
        </div>
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.02em]">
          The Morocco Oracle
        </Link>
      </nav>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Announcement bar */}
      <div className="px-8 py-8">
        <p className="text-[11px] uppercase tracking-[0.15em] font-medium">
          Investment Intelligence
        </p>
        <p className="text-[11px] uppercase tracking-[0.15em] mt-2">
          2030 World Cup · Morocco
        </p>
      </div>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Hero — MASSIVE typography */}
      <section className="px-8 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(4rem,12vw,11rem)] font-bold leading-[0.85] tracking-[-0.03em]"
        >
          WHERE THE
          <br />
          MONEY MOVES
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[13px] uppercase tracking-[0.15em] mt-12"
        >
          National Investment Intelligence
        </motion.p>
      </section>

      {/* Full bleed image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="w-full aspect-[21/9] bg-gray-100 relative overflow-hidden"
      >
        {/* Placeholder for dramatic Morocco aerial/architecture shot */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
        <div className="absolute bottom-8 left-8">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-600">
            Casablanca · Grand Theatre
          </p>
        </div>
      </motion.div>

      {/* Stats — Editorial, not boxes */}
      <section className="px-8 py-24">
        <div className="grid grid-cols-3 gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
              Capital Deployed
            </p>
            <p className="text-[4rem] font-bold tracking-[-0.03em] mt-4 leading-none">
              €4.2B
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
              Active Projects
            </p>
            <p className="text-[4rem] font-bold tracking-[-0.03em] mt-4 leading-none">
              247
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
              2030 Readiness
            </p>
            <p className="text-[4rem] font-bold tracking-[-0.03em] mt-4 leading-none">
              87%
            </p>
          </div>
        </div>
      </section>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Section — Infrastructure */}
      <section className="px-8 py-24">
        <Link href="/infrastructure" className="group block">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            01 · Infrastructure
          </p>
          <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.9] tracking-[-0.03em] mt-6 group-hover:text-gray-500 transition-colors">
            THE SKELETON
            <br />
            OF 2030
          </h2>
          <p className="text-[13px] leading-relaxed mt-8 max-w-md text-gray-600">
            Six stadiums. 1,300 kilometers of high-speed rail. 
            Desalination plants. Solar farms. Everything that 
            must exist before 26 million visitors arrive.
          </p>
        </Link>
      </section>

      {/* Image */}
      <div className="mx-8 aspect-[16/7] bg-gray-100 relative">
        <div className="absolute bottom-6 left-6">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-600">
            Grand Stade de Casablanca · 115,000 capacity
          </p>
        </div>
      </div>

      {/* Thin rule */}
      <div className="mx-8 mt-24 h-px bg-gray-200" />

      {/* Section — Heat Map */}
      <section className="px-8 py-24">
        <Link href="/heat" className="group block">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            02 · Heat Map
          </p>
          <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.9] tracking-[-0.03em] mt-6 group-hover:text-gray-500 transition-colors">
            FOLLOW THE
            <br />
            CAPITAL
          </h2>
          <p className="text-[13px] leading-relaxed mt-8 max-w-md text-gray-600">
            Transaction volume. Price appreciation. Foreign buyer 
            concentration. See where the money flows before 
            it flows there.
          </p>
        </Link>
      </section>

      {/* Thin rule */}
      <div className="mx-8 h-px bg-gray-200" />

      {/* Section — Pipeline */}
      <section className="px-8 py-24">
        <Link href="/pipeline" className="group block">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            03 · Pipeline
          </p>
          <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.9] tracking-[-0.03em] mt-6 group-hover:text-gray-500 transition-colors">
            THE FUTURE,
            <br />
            TRACKED
          </h2>
          <p className="text-[13px] leading-relaxed mt-8 max-w-md text-gray-600">
            Every hotel, resort, and development project. 
            Confirmed, under construction, rumored. 
            247 projects. €4.2 billion in value.
          </p>
        </Link>
      </section>

      {/* Dark section — API */}
      <section className="bg-black text-white px-8 py-32">
        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
          For Machines
        </p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.9] tracking-[-0.02em] mt-6">
          API ACCESS
        </h2>
        <p className="text-[13px] leading-relaxed mt-8 max-w-md text-gray-400">
          The beauty is for humans. The API is for machines. 
          Clean JSON. Real-time data. The toll road to Morocco intelligence.
        </p>
        <Link 
          href={"/api" as any}
          className="inline-block mt-12 text-[11px] uppercase tracking-[0.15em] border-b border-white pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors"
        >
          Request Access →
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 flex items-center justify-between border-t border-gray-200">
        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
          © 2026 The Morocco Oracle
        </p>
        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
          Casablanca · London · Singapore
        </p>
      </footer>
    </div>
  );
}
