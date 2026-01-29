'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  // Generous horizontal padding — scales up on larger screens
  const px = "px-10 md:px-16 lg:px-24 xl:px-32";
  const mx = "mx-10 md:mx-16 lg:mx-24 xl:mx-32";

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Navigation — Simple text, generous spacing */}
      <nav className={`${px} py-10 flex items-center justify-between`}>
        <div className="flex items-center gap-10">
          <span className="text-[11px] uppercase tracking-[0.15em]">English</span>
          <span className="text-[11px] uppercase tracking-[0.15em] text-gray-300">Français</span>
        </div>
        <div className="flex items-center gap-12">
          <Link href="/infrastructure" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-400 transition-colors">
            Infrastructure
          </Link>
          <Link href="/heat" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-400 transition-colors">
            Heat Map
          </Link>
          <Link href="/pipeline" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-400 transition-colors">
            Pipeline
          </Link>
          <Link href="/dashboard" className="text-[11px] uppercase tracking-[0.15em] hover:text-gray-400 transition-colors">
            Portfolio
          </Link>
        </div>
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.02em]">
          The Morocco Oracle
        </Link>
      </nav>

      {/* Thin rule */}
      <div className={`${mx} h-px bg-gray-200`} />

      {/* Announcement bar */}
      <div className={`${px} py-12`}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
          Investment Intelligence
        </p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-3">
          2030 World Cup · Morocco
        </p>
      </div>

      {/* Thin rule */}
      <div className={`${mx} h-px bg-gray-200`} />

      {/* Hero — MASSIVE typography with lots of vertical space */}
      <section className={`${px} pt-24 pb-32`}>
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(4rem,14vw,13rem)] font-bold leading-[0.82] tracking-[-0.04em]"
        >
          WHERE THE
          <br />
          MONEY MOVES
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[12px] uppercase tracking-[0.2em] text-gray-400 mt-16"
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
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
        <div className="absolute bottom-10 left-10 md:left-16 lg:left-24 xl:left-32">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            Casablanca · Grand Theatre
          </p>
        </div>
      </motion.div>

      {/* Stats — Editorial, generous spacing */}
      <section className={`${px} py-32`}>
        <div className="grid grid-cols-3 gap-16 lg:gap-24">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              Capital Deployed
            </p>
            <p className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.03em] mt-6 leading-none">
              €4.2B
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              Active Projects
            </p>
            <p className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.03em] mt-6 leading-none">
              247
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              2030 Readiness
            </p>
            <p className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.03em] mt-6 leading-none">
              87%
            </p>
          </div>
        </div>
      </section>

      {/* Thin rule */}
      <div className={`${mx} h-px bg-gray-200`} />

      {/* Section — Infrastructure */}
      <section className={`${px} py-32`}>
        <Link href="/infrastructure" className="group block">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
            01 · Infrastructure
          </p>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.85] tracking-[-0.04em] mt-10 group-hover:text-gray-400 transition-colors duration-300">
            THE SKELETON
            <br />
            OF 2030
          </h2>
          <p className="text-[14px] leading-[1.8] mt-12 max-w-lg text-gray-500">
            Six stadiums. 1,300 kilometers of high-speed rail. 
            Desalination plants. Solar farms. Everything that 
            must exist before 26 million visitors arrive.
          </p>
        </Link>
      </section>

      {/* Image */}
      <div className={`${mx} aspect-[16/7] bg-gray-100 relative`}>
        <div className="absolute bottom-8 left-8">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            Grand Stade de Casablanca · 115,000 capacity
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-32" />

      {/* Thin rule */}
      <div className={`${mx} h-px bg-gray-200`} />

      {/* Section — Heat Map */}
      <section className={`${px} py-32`}>
        <Link href="/heat" className="group block">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
            02 · Heat Map
          </p>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.85] tracking-[-0.04em] mt-10 group-hover:text-gray-400 transition-colors duration-300">
            FOLLOW THE
            <br />
            CAPITAL
          </h2>
          <p className="text-[14px] leading-[1.8] mt-12 max-w-lg text-gray-500">
            Transaction volume. Price appreciation. Foreign buyer 
            concentration. See where the money flows before 
            it flows there.
          </p>
        </Link>
      </section>

      {/* Thin rule */}
      <div className={`${mx} h-px bg-gray-200`} />

      {/* Section — Pipeline */}
      <section className={`${px} py-32`}>
        <Link href="/pipeline" className="group block">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
            03 · Pipeline
          </p>
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.85] tracking-[-0.04em] mt-10 group-hover:text-gray-400 transition-colors duration-300">
            THE FUTURE,
            <br />
            TRACKED
          </h2>
          <p className="text-[14px] leading-[1.8] mt-12 max-w-lg text-gray-500">
            Every hotel, resort, and development project. 
            Confirmed, under construction, rumored. 
            247 projects. €4.2 billion in value.
          </p>
        </Link>
      </section>

      {/* Spacer before dark section */}
      <div className="h-16" />

      {/* Dark section — API */}
      <section className="bg-black text-white px-10 md:px-16 lg:px-24 xl:px-32 py-40">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
          For Machines
        </p>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.03em] mt-10">
          API ACCESS
        </h2>
        <p className="text-[14px] leading-[1.8] mt-12 max-w-lg text-gray-400">
          The beauty is for humans. The API is for machines. 
          Clean JSON. Real-time data. The toll road to Morocco intelligence.
        </p>
        <Link 
          href={"/api" as any}
          className="inline-block mt-16 text-[11px] uppercase tracking-[0.2em] border-b border-white/30 pb-2 hover:text-gray-400 hover:border-gray-400 transition-colors"
        >
          Request Access →
        </Link>
      </section>

      {/* Footer */}
      <footer className={`${px} py-12 flex items-center justify-between`}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300">
          © 2026 The Morocco Oracle
        </p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300">
          Casablanca · London · Singapore
        </p>
      </footer>

      {/* Bottom breathing room */}
      <div className="h-8" />
    </div>
  );
}
