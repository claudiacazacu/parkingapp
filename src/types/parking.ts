/**
 * Raw parking spot from initial data
 */
export interface RawParkingSpot {
  id: number;
  name: string;
  type: ParkingType;
  area: string;
  address: string;
  totalSpots: number;
  freeSpots: number;
  pricePerHour: number;
  distanceKm: number;
  trafficLevel: TrafficLevel;
  etaMinutes: number;
  prediction: string;
  peakHours: string;
  rating: number;
  lat: number;
  lng: number;
}

/**
 * Enriched parking spot with computed fields
 */
export interface EnrichedParkingSpot extends RawParkingSpot {
  recommendation: number;
  occupancy: number;
  status: AvailabilityStatus;
  predictedFreeSpots: number;
  isFavorite: boolean;
  isCompared: boolean;
  tags: string[];
}

/**
 * Availability status information
 */
export interface AvailabilityStatus {
  label: "Disponibil" | "Limitat" | "Aproape plin";
  className: string;
}

/**
 * Parking type
 */
export type ParkingType = "Mall" | "Office" | "Hypermarket";

/**
 * Traffic level
 */
export type TrafficLevel = "Scăzut" | "Mediu" | "Ridicat";

/**
 * Time mode for predictions
 */
export type TimeMode = "Acum" | "30 min" | "60 min" | "Seara";

/**
 * Sort option
 */
export type SortOption =
  | "recommendation"
  | "distance"
  | "availability"
  | "predicted"
  | "price";
