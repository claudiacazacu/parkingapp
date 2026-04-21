import React from "react";
import { Navigation, TrendingUp, Star } from "lucide-react";
import type {
  EnrichedParkingSpot,
  RawParkingSpot,
  TimeMode,
} from "../types/parking";
import {
  formatPrice,
  predictFreeSpots,
} from "../utils/parkingUtils";

interface SidebarProps {
  selected: EnrichedParkingSpot | RawParkingSpot;
  timeMode: TimeMode;
  comparedSpots: EnrichedParkingSpot[];
  favoriteSpots: EnrichedParkingSpot[];
  openInMaps: (spot: EnrichedParkingSpot | RawParkingSpot) => void;
  toggleCompare: (id: number) => void;
  toggleFavorite: (id: number) => void;
}

export default function Sidebar({
  selected,
  timeMode,
  comparedSpots,
  favoriteSpots,
  openInMaps,
  toggleCompare,
  toggleFavorite,
}: SidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-3xl shadow-sm border-0 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Detalii Selectate</h2>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="text-2xl font-bold">{selected.name}</div>
            <p className="text-slate-400 text-sm">{selected.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="text-xs text-slate-400">Preț/Oră</div>
              <div className="font-bold">
                {formatPrice(selected.pricePerHour)}
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="text-xs text-slate-400">Rating</div>
              <div className="font-bold">⭐ {selected.rating}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="text-xs text-slate-400">Trafic</div>
              <div className="font-bold">{selected.trafficLevel}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="text-xs text-slate-400">ETA</div>
              <div className="font-bold">{selected.etaMinutes} min</div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp size={16} />
              Predicție
            </div>
            <p className="text-sm text-slate-300">{selected.prediction}</p>
            <p className="text-sm text-slate-300">
              Estimare pentru {timeMode}: {predictFreeSpots(selected, timeMode)} locuri libere
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Star size={16} />
              Interval de vârf
            </div>
            <p className="text-sm text-slate-300">{selected.peakHours}</p>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 bg-white text-slate-900 hover:bg-slate-200 w-full"
            onClick={() => openInMaps(selected)}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Navighează Acum
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Comparare</h2>
        </div>

        <div className="p-5 space-y-3">
          {comparedSpots.length === 0 ? (
            <p className="text-sm text-slate-500">
              Selectează până la 3 parcări pentru comparare.
            </p>
          ) : (
            comparedSpots.map((spot) => (
              <div
                key={spot.id}
                className="rounded-2xl border border-slate-100 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {spot.name}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>Distanță: {spot.distanceKm} km</div>
                      <div>Preț: {formatPrice(spot.pricePerHour)}</div>
                      <div>Libere: {spot.freeSpots}</div>
                      <div>Trafic: {spot.trafficLevel}</div>
                      <div>Scor: {spot.recommendation}/100</div>
                      <div>ETA: {spot.etaMinutes} min</div>
                    </div>
                  </div>

                  <button
                    className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 bg-transparent hover:bg-slate-100 text-slate-900 text-xs"
                    onClick={() => toggleCompare(spot.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Favorite</h2>
        </div>

        <div className="p-5 space-y-3">
          {favoriteSpots.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nu ai adăugat încă parcări la favorite.
            </p>
          ) : (
            favoriteSpots.map((spot) => (
              <div
                key={spot.id}
                className="rounded-2xl border border-slate-100 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {spot.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {spot.area} · {spot.freeSpots} locuri ·{" "}
                      {formatPrice(spot.pricePerHour)}
                    </div>
                  </div>

                  <button
                    className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 bg-transparent hover:bg-slate-100 text-slate-900 text-xs"
                    onClick={() => toggleFavorite(spot.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
