import { createContext, useContext, useState } from "react";

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  const triggerReload = () => setReloadKey((k) => k + 1);

  return (
    <AppStateContext.Provider
      value={{ reloadKey, triggerReload, lowStockThreshold, setLowStockThreshold }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}
