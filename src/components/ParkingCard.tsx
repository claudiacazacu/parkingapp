import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Car, Clock3, Heart, Scale } from "lucide-react";
import type { EnrichedParkingSpot, TimeMode } from "../types/parking";
import {
  formatPrice,
  recommendationLabel,
} from "../utils/parkingUtils";

interface ParkingCardProps {
  spot: EnrichedParkingSpot;
  timeMode: TimeMode;
  onClick: () => void;
  isSelected: boolean;
  toggleFavorite: (id: number) => void;
  toggleCompare: (id: number) => void;
}

export default function ParkingCard({
  spot,
  timeMode,
  onClick,
  isSelected,
  toggleFavorite,
  toggleCompare,
}: ParkingCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:scale-[1.01] cursor-pointer ${
        isSelected ? "ring-2 ring-slate-900" : ""
      }`}
      onClick={onClick}
    >
      <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900">{spot.name}</h3>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${spot.status.className}`}
            >
              {spot.status.label}
            </span>

            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700">
              {spot.type}
            </span>

            {spot.isFavorite && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700">
                Favorit
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {spot.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {spot.area}
            </span>
            <span className="flex items-center gap-1">
              <Car size={14} /> {spot.freeSpots}/{spot.totalSpots}
            </span>
            <span className="flex items-center gap-1">
              <Clock3 size={14} /> {spot.etaMinutes} min
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Grad ocupare</span>
              <span>{spot.occupancy}%</span>
            </div>

            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 mt-2">
              <div
                className="h-full w-full flex-1 bg-slate-900 transition-all"
                style={{
                  transform: `translateX(-${100 - (spot.occupancy || 0)}%)`,
                }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Estimare pentru <span className="font-semibold">{timeMode}</span>:{" "}
            <span className="font-semibold text-slate-700">
              {spot.predictedFreeSpots} locuri libere
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(spot.id);
              }}
            >
              <Heart className="mr-2 h-4 w-4" />
              {spot.isFavorite ? "Scos din favorite" : "Favorite"}
            </button>

            <button
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(spot.id);
              }}
            >
              <Scale className="mr-2 h-4 w-4" />
              {spot.isCompared ? "Scos din comparare" : "Compară"}
            </button>

            <Link
              to={`/parking/${spot.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 text-xs"
            >
              Detalii
            </Link>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl min-w-[170px] text-right space-y-1">
          <div className="text-xs text-slate-500">Scor</div>
          <div className="text-xl font-black text-slate-900">
            {spot.recommendation}/100
          </div>
          <div className="text-[10px] font-bold text-blue-600 uppercase">
            {recommendationLabel(spot.recommendation)}
          </div>
          <div className="text-xs text-slate-500 pt-1">
            {formatPrice(spot.pricePerHour)}
          </div>
        </div>
      </div>
    </div>
  );
}