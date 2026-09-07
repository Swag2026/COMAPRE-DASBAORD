import { Navigate, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import TotalStockPage from "./pages/TotalStockPage";
import BranchStockPage from "./pages/BranchStockPage";
import ReorderPage from "./pages/ReorderPage";
import TransfersPage from "./pages/TransfersPage";
import ComingSoonPage from "./pages/ComingSoonPage";

export default function App() {
  return (
    <div style={{ minHeight: "100%", background: "var(--odoo-bg)" }}>
      <TopBar />
      <Routes>
        <Route path="/" element={<Navigate to="/total-stock" replace />} />
        <Route path="/total-stock" element={<TotalStockPage />} />
        <Route path="/branch-stock" element={<BranchStockPage />} />
        <Route path="/reorder" element={<ReorderPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
        <Route
          path="/season-comparison"
          element={<ComingSoonPage title="Season Comparison" />}
        />
      </Routes>
    </div>
  );
}
