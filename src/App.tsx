import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ParkingDetailsPage from "./pages/ParkingDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/parking/:id" element={<ParkingDetailsPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/compare" element={<ComparePage />} />
    </Routes>
  );
}
