import { Link } from "react-router-dom";
import ParkingCard from "../components/ParkingCard";
import { useParking } from "../hooks/useParking";

export default function FavoritesPage() {
  const { favoriteSpots, toggleFavorite, toggleCompare, timeMode } = useParking();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Favorite</h1>
          <Link
            to="/"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Înapoi acasă
          </Link>
        </div>

        {favoriteSpots.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm">
            <p className="text-slate-500">Nu ai încă parcări salvate la favorite.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteSpots.map((spot) => (
              <ParkingCard
                key={spot.id}
                spot={spot}
                timeMode={timeMode}
                isSelected={false}
                onClick={() => {}}
                toggleFavorite={toggleFavorite}
                toggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}