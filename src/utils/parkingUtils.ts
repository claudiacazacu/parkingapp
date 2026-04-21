import type { RawParkingSpot, AvailabilityStatus, TrafficLevel, TimeMode } from "../types/parking";

/**
 * Traffic level to numeric score mapping
 */
const trafficScoreMap: Record<TrafficLevel, number> = {
  Scăzut: 1,
  Mediu: 2,
  Ridicat: 3,
};

/**
 * Calculate occupancy percentage
 */
export function occupancyPercent(freeSpots: number, totalSpots: number): number {
  return Math.round(((totalSpots - freeSpots) / totalSpots) * 100);
}

/**
 * Determine availability status based on free spots ratio
 */
export function availabilityStatus(
  freeSpots: number,
  totalSpots: number
): AvailabilityStatus {
  const ratio = freeSpots / totalSpots;
  if (ratio > 0.25)
    return { label: "Disponibil", className: "bg-green-100 text-green-700" };
  if (ratio > 0.1)
    return { label: "Limitat", className: "bg-yellow-100 text-yellow-700" };
  return { label: "Aproape plin", className: "bg-red-100 text-red-700" };
}

/**
 * Compute recommendation score for a parking spot
 */
export function computeRecommendation(spot: RawParkingSpot): number {
  const availabilityFactor = (spot.freeSpots / spot.totalSpots) * 50;
  const distanceFactor = Math.max(0, 25 - spot.distanceKm * 4);
  const etaFactor = Math.max(0, 15 - spot.etaMinutes * 0.7);
  const trafficPenalty = trafficScoreMap[spot.trafficLevel] * 6;
  const priceBonus =
    spot.pricePerHour === 0 ? 8 : Math.max(0, 8 - spot.pricePerHour);

  return Math.round(
    availabilityFactor +
      distanceFactor +
      etaFactor +
      priceBonus -
      trafficPenalty +
      spot.rating * 4
  );
}

/**
 * Get human-readable label for recommendation score
 */
export function recommendationLabel(score: number): string {
  if (score >= 55) return "Cea mai bună alegere";
  if (score >= 45) return "Foarte bună";
  if (score >= 35) return "Bună";
  return "Rezervă";
}

/**
 * Format price to human-readable string
 */
export function formatPrice(price: number): string {
  return price === 0 ? "Gratuit" : `${price} lei/oră`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Predict free spots based on time mode
 */
export function predictFreeSpots(
  spot: RawParkingSpot,
  mode: TimeMode
): number {
  const trafficImpact =
    spot.trafficLevel === "Ridicat"
      ? -25
      : spot.trafficLevel === "Mediu"
      ? -10
      : 5;

  const base = spot.freeSpots;

  if (mode === "Acum") return base;
  if (mode === "30 min") return clamp(base + trafficImpact, 0, spot.totalSpots);
  if (mode === "60 min")
    return clamp(base + trafficImpact + 15, 0, spot.totalSpots);
  if (mode === "Seara") return clamp(base + 35, 0, spot.totalSpots);

  return base;
}

/**
 * Build extra tags for a parking spot
 */
export function buildExtraTags(spot: RawParkingSpot): string[] {
  const tags: string[] = [];

  if (spot.pricePerHour === 0) tags.push("Gratuit");
  if (spot.etaMinutes <= 10) tags.push("Acces rapid");
  if (spot.trafficLevel === "Ridicat") tags.push("Trafic intens");
  if (spot.type === "Office") tags.push("Office");
  if (spot.type === "Mall") tags.push("Shopping");
  if (spot.rating >= 4.5) tags.push("Rating mare");

  return tags.slice(0, 3);
}
