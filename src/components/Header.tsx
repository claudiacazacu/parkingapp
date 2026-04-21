import React from "react";

interface HeaderProps {
  lastUpdated: Date;
  parkingCount: number;
  totalFreeSpots: number;
  closestSpot: number;
  favoriteCount: number;
}

export default function Header({
  lastUpdated,
  parkingCount,
  totalFreeSpots,
  closestSpot,
  favoriteCount,
}: HeaderProps) {
  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
            Parking Aggregator MVP
          </span>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Găsește rapid un loc de parcare
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Disponibilitate aproape în timp real, recomandări inteligente,
            predicții și comparare pentru București.
          </p>
          <div className="text-xs text-slate-400">
            Ultima actualizare: {lastUpdated.toLocaleTimeString("ro-RO")}
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="bg-white/10 p-3 rounded-2xl text-center">
            <div className="text-xs text-slate-300">Parcări</div>
            <div className="text-xl font-bold">{parkingCount}</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl text-center">
            <div className="text-xs text-slate-300">Locuri Libere</div>
            <div className="text-xl font-bold">{totalFreeSpots}</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl text-center">
            <div className="text-xs text-slate-300">Cel mai aproape</div>
            <div className="text-xl font-bold">{closestSpot} km</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl text-center">
            <div className="text-xs text-slate-300">Favorite</div>
            <div className="text-xl font-bold">{favoriteCount}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
