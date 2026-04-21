import { useEffect, useMemo, useState } from "react";
import { initialParkingData } from "../data/parkingData";
import {
  availabilityStatus,
  buildExtraTags,
  clamp,
  computeRecommendation,
  occupancyPercent,
  predictFreeSpots,
} from "../utils/parkingUtils";
import type {
  EnrichedParkingSpot,
  RawParkingSpot,
  SortOption,
  TimeMode,
} from "../types/parking";

const FAVORITES_KEY = "parking-favorites";
const COMPARE_KEY = "parking-compare";

export function useParking() {
  const [parkingData, setParkingData] = useState<RawParkingSpot[]>(initialParkingData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Toate");
  const [statusFilter, setStatusFilter] = useState("Toate");
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy] = useState<SortOption>("recommendation");
  const [timeMode, setTimeMode] = useState<TimeMode>("Acum");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [compareIds, setCompareIds] = useState<number[]>(() => {
    const saved = localStorage.getItem(COMPARE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

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

  const enriched = useMemo<EnrichedParkingSpot[]>(() => {
    return parkingData.map((spot) => {
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

    const result = enriched.filter((spot) => {
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

  const favoriteSpots = enriched.filter((spot) => favorites.includes(spot.id));
  const comparedSpots = enriched.filter((spot) => compareIds.includes(spot.id));
  const bestOption = filtered[0];
  const totalFreeSpots = parkingData.reduce((acc, item) => acc + item.freeSpots, 0);
  const closestSpot = Math.min(...parkingData.map((p) => p.distanceKm));
  const types = ["Toate", ...Array.from(new Set(parkingData.map((p) => p.type)))];

  const getParkingById = (id: number) => enriched.find((spot) => spot.id === id);

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

  return {
    parkingData,
    enriched,
    filtered,
    favoriteSpots,
    comparedSpots,
    bestOption,
    totalFreeSpots,
    closestSpot,
    types,
    favorites,
    compareIds,
    lastUpdated,
    search,
    typeFilter,
    statusFilter,
    maxDistance,
    sortBy,
    timeMode,
    setSearch,
    setTypeFilter,
    setStatusFilter,
    setMaxDistance,
    setSortBy,
    setTimeMode,
    toggleFavorite,
    toggleCompare,
    resetFilters,
    getParkingById,
  };
}