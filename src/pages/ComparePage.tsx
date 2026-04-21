import { Link } from "react-router-dom";
import { useParking } from "../hooks/useParking";
import { formatPrice } from "../utils/parkingUtils";

export default function ComparePage() {
  const { comparedSpots, toggleCompare } = useParking();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Comparare parcări</h1>
          <Link
            to="/"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Înapoi acasă
          </Link>
        </div>

        {comparedSpots.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm">
            <p className="text-slate-500">Nu ai selectat încă parcări pentru comparare.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {comparedSpots.map((spot) => (
              <div key={spot.id} className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{spot.name}</h2>
                    <p className="text-sm text-slate-500">{spot.area}</p>
                  </div>
                  <button
                    onClick={() => toggleCompare(spot.id)}
                    className="rounded-xl border border-slate-200 px-3 py-1 text-sm hover:bg-slate-100"
                  >
                    Scoate
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-500">Locuri libere</div>
                    <div className="font-bold text-slate-900">{spot.freeSpots}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-500">Preț</div>
                    <div className="font-bold text-slate-900">{formatPrice(spot.pricePerHour)}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-500">Distanță</div>
                    <div className="font-bold text-slate-900">{spot.distanceKm} km</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-500">ETA</div>
                    <div className="font-bold text-slate-900">{spot.etaMinutes} min</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-500">Trafic</div>
                    <div className="font-bold text-slate-900">{spot.trafficLevel}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-slate-500">Scor</div>
                    <div className="font-bold text-slate-900">{spot.recommendation}/100</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}