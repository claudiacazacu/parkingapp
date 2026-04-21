import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Scale, Navigation } from "lucide-react";
import { useParking } from "../hooks/useParking";
import { formatPrice, recommendationLabel } from "../utils/parkingUtils";

export default function ParkingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getParkingById, toggleFavorite, toggleCompare, timeMode } = useParking();

  const parking = getParkingById(Number(id));

  if (!parking) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Înapoi
          </Link>
          <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <h1 className="text-2xl font-bold">Parcarea nu a fost găsită</h1>
          </div>
        </div>
      </div>
    );
  }

  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${parking.lat},${parking.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Înapoi
        </button>

        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold text-slate-900">{parking.name}</h1>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${parking.status.className}`}>
                    {parking.status.label}
                  </span>
                </div>
                <p className="text-slate-500">{parking.address}</p>
                <div className="flex flex-wrap gap-2">
                  {parking.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-slate-500">Scor recomandare</div>
                <div className="text-3xl font-black text-slate-900">{parking.recommendation}/100</div>
                <div className="text-sm font-semibold text-blue-600">
                  {recommendationLabel(parking.recommendation)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Locuri disponibile</div>
                <div className="text-2xl font-bold text-slate-900">
                  {parking.freeSpots} / {parking.totalSpots}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Preț</div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatPrice(parking.pricePerHour)}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Estimare pentru {timeMode}</div>
                <div className="text-2xl font-bold text-slate-900">
                  {parking.predictedFreeSpots} locuri
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Distanță</div>
                <div className="text-xl font-bold text-slate-900">{parking.distanceKm} km</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">ETA</div>
                <div className="text-xl font-bold text-slate-900">{parking.etaMinutes} min</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Trafic / Rating</div>
                <div className="text-xl font-bold text-slate-900">
                  {parking.trafficLevel} · ⭐ {parking.rating}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-900 mb-2">Predicție</div>
              <p className="text-slate-600">{parking.prediction}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-900 mb-2">Interval de vârf</div>
              <p className="text-slate-600">{parking.peakHours}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toggleFavorite(parking.id)}
                className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
              >
                <Heart className="mr-2 h-4 w-4" />
                {parking.isFavorite ? "Scoate din favorite" : "Adaugă la favorite"}
              </button>

              <button
                onClick={() => toggleCompare(parking.id)}
                className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
              >
                <Scale className="mr-2 h-4 w-4" />
                {parking.isCompared ? "Scoate din comparare" : "Adaugă la comparare"}
              </button>

              <button
                onClick={openInMaps}
                className="inline-flex items-center rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Navighează
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}