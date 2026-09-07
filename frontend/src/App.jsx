import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./api/AuthContext";
import { AppStateProvider } from "./api/AppStateContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import TotalStockPage from "./pages/TotalStockPage";
import BranchStockPage from "./pages/BranchStockPage";
import ReorderPage from "./pages/ReorderPage";
import TransfersPage from "./pages/TransfersPage";
import ComingSoonPage from "./pages/ComingSoonPage";

function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <TopBar />
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/total-stock" replace /> : <LoginPage />}
      />
      <Route path="/" element={<Navigate to="/total-stock" replace />} />
      <Route
        path="/total-stock"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TotalStockPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/branch-stock"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BranchStockPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reorder"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReorderPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TransfersPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/season-comparison"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ComingSoonPage title="Season Comparison" />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <div style={{ minHeight: "100%", background: "var(--odoo-bg)" }}>
          <AppRoutes />
        </div>
      </AppStateProvider>
    </AuthProvider>
  );
}
