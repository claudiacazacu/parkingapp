import React from "react";
import { Filter, RotateCcw, Search } from "lucide-react";
import type { TimeMode, SortOption } from "../types/parking";

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  timeMode: TimeMode;
  setTimeMode: (value: TimeMode) => void;
  types: string[];
  resetFilters: () => void;
}

export default function Filters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  maxDistance,
  setMaxDistance,
  sortBy,
  setSortBy,
  timeMode,
  setTimeMode,
  types,
  resetFilters,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Filter size={18} />
            Filtre
          </h2>

          <button
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900"
            onClick={resetFilters}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetează
          </button>
        </div>
      </div>

      <div className="p-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">
            Caută
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              placeholder="Nume, zonă sau adresă..."
              className="flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">
            Tip
          </label>
          <select
            className="w-full h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">
            Status
          </label>
          <select
            className="w-full h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Toate">Toate</option>
            <option value="Disponibil">Disponibil</option>
            <option value="Limitat">Limitat</option>
            <option value="Aproape plin">Aproape plin</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">
            Sortează
          </label>
          <select
            className="w-full h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="recommendation">Recomandare</option>
            <option value="distance">Distanță</option>
            <option value="availability">Locuri libere</option>
            <option value="predicted">Predicție</option>
            <option value="price">Preț</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">
            Predicție pentru
          </label>
          <select
            className="w-full h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            value={timeMode}
            onChange={(e) => setTimeMode(e.target.value as TimeMode)}
          >
            <option value="Acum">Acum</option>
            <option value="30 min">30 min</option>
            <option value="60 min">60 min</option>
            <option value="Seara">Seara</option>
          </select>
        </div>

        <div className="md:col-span-2 xl:col-span-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase text-slate-500">
              Distanță maximă
            </label>
            <span className="text-sm font-semibold text-slate-700">
              {maxDistance} km
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
