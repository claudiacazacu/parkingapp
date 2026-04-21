import React, { useEffect, useMemo, useState } from "react";
import { Navigation } from "lucide-react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ParkingCard from "../components/ParkingCard";
import Sidebar from "../components/Sidebar";
import { initialParkingData } from "../data/parkingData";
import {
  occupancyPercent,
  availabilityStatus,
  computeRecommendation,
  buildExtraTags,
  formatPrice,
  predictFreeSpots,
  clamp,
} from "../utils/parkingUtils";
import type {
  RawParkingSpot,
  EnrichedParkingSpot,
  TimeMode,
  SortOption,
} from "../types/parking";

const Card = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
  };
  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function HomePage() {
  const [parkingData, setParkingData] = useState<RawParkingSpot[]>(initialParkingData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Toate");
  const [statusFilter, setStatusFilter] = useState("Toate");
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy] = useState<SortOption>("recommendation");
  const [timeMode, setTimeMode] = useState<TimeMode>("Acum");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selected, setSelected] = useState<EnrichedParkingSpot | RawParkingSpot>(
    initialParkingData[0]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setParkingData((prev) =>
        prev.map((spot) => {
          const change = Math.floor(Math.random() * 21) - 10;
          const nextFreeSpots = clamp(spot.freeSpots + change, 0, spot.totalSpots);

          return {
            ...spot,
            freeSpots: nextFreeSpots,
          };
        })
      );

      setLastUpdated(new Date());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const types = ["Toate", ...Array.from(new Set(parkingData.map((p) => p.type)))];
  const favoriteCount = favorites.length;

  const enriched = useMemo(() => {
    return parkingData.map((spot): EnrichedParkingSpot => {
      const recommendation = computeRecommendation(spot);
      const status = availabilityStatus(spot.freeSpots, spot.totalSpots);

      return {
        ...spot,
        recommendation,
        occupancy: occupancyPercent(spot.freeSpots, spot.totalSpots),
        status,
        predictedFreeSpots: predictFreeSpots(spot, timeMode),
        isFavorite: favorites.includes(spot.id),
        isCompared: compareIds.includes(spot.id),
        tags: buildExtraTags(spot),
      };
    });
  }, [parkingData, timeMode, favorites, compareIds]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    let result = enriched.filter((spot) => {
      const matchesSearch =
        spot.name.toLowerCase().includes(normalizedSearch) ||
        spot.area.toLowerCase().includes(normalizedSearch) ||
        spot.address.toLowerCase().includes(normalizedSearch);

      const matchesType = typeFilter === "Toate" || spot.type === typeFilter;
      const matchesDistance = spot.distanceKm <= maxDistance;
      const matchesStatus =
        statusFilter === "Toate" || spot.status.label === statusFilter;

      return matchesSearch && matchesType && matchesDistance && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "availability") return b.freeSpots - a.freeSpots;
      if (sortBy === "price") return a.pricePerHour - b.pricePerHour;
      if (sortBy === "predicted") return b.predictedFreeSpots - a.predictedFreeSpots;
      return b.recommendation - a.recommendation;
    });

    return result;
  }, [enriched, search, typeFilter, statusFilter, maxDistance, sortBy]);

  const comparedSpots = enriched.filter((spot) => compareIds.includes(spot.id));
  const favoriteSpots = enriched.filter((spot) => favorites.includes(spot.id));
  const bestOption = filtered[0];

  useEffect(() => {
    const updatedSelected = enriched.find((p) => p.id === selected.id);
    if (updatedSelected) {
      setSelected(updatedSelected);
    }
  }, [enriched, selected.id]);

  const totalFreeSpots = parkingData.reduce((acc, item) => acc + item.freeSpots, 0);
  const closestSpot = Math.min(...parkingData.map((p) => p.distanceKm));

  const openInMaps = (spot: EnrichedParkingSpot | RawParkingSpot) => {
    const url = `https://www.google.com/maps?q=${spot.lat},${spot.lng}`;
    window.open(url, "_blank");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, id];
    });
  };

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("Toate");
    setStatusFilter("Toate");
    setMaxDistance(10);
    setSortBy("recommendation");
    setTimeMode("Acum");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <Header
          lastUpdated={lastUpdated}
          parkingCount={parkingData.length}
          totalFreeSpots={totalFreeSpots}
          closestSpot={closestSpot}
          favoriteCount={favoriteCount}
        />

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Main */}
          <div className="xl:col-span-2 space-y-6">
            <Filters
              search={search}
              setSearch={setSearch}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              sortBy={sortBy}
              setSortBy={setSortBy}
              timeMode={timeMode}
              setTimeMode={setTimeMode}
              types={types}
              resetFilters={resetFilters}
            />

            {bestOption && (
              <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wide text-slate-300">
                      Recomandarea principală
                    </div>
                    <div className="text-2xl font-bold">{bestOption.name}</div>
                    <div className="text-sm text-slate-300">
                      {bestOption.freeSpots} locuri libere · {bestOption.distanceKm} km ·{" "}
                      {formatPrice(bestOption.pricePerHour)}
                    </div>
                    <div className="text-sm text-slate-300">
                      Estimare pentru {timeMode}: {bestOption.predictedFreeSpots} locuri
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelected(bestOption);
                      openInMaps(bestOption);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-white text-slate-900 hover:bg-slate-200 transition-colors"
                  >
                    <Navigation className="mr-2 h-4 w-4 text-slate-900" />
                    Navighează
                  </button>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {filtered.map((spot) => (
                <ParkingCard
                  key={spot.id}
                  spot={spot}
                  timeMode={timeMode}
                  onClick={() => setSelected(spot)}
                  isSelected={selected.id === spot.id}
                  toggleFavorite={toggleFavorite}
                  toggleCompare={toggleCompare}
                />
              ))}

              {filtered.length === 0 && (
                <Card>
                  <CardContent className="p-10 text-center text-slate-500">
                    Nu există parcări care să corespundă filtrelor selectate.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar
            selected={selected}
            timeMode={timeMode}
            comparedSpots={comparedSpots}
            favoriteSpots={favoriteSpots}
            openInMaps={openInMaps}
            toggleCompare={toggleCompare}
            toggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}



