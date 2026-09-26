import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 60,
          right: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              minWidth: 240,
              maxWidth: 340,
              background: t.type === "error" ? "#FDECEC" : t.type === "success" ? "#E9F7EC" : "#fff",
              border: `1px solid ${t.type === "error" ? "var(--odoo-danger)" : t.type === "success" ? "var(--odoo-success)" : "var(--odoo-border)"}`,
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 12.5,
              fontWeight: 500,
              color: t.type === "error" ? "#7A1E1E" : t.type === "success" ? "#065F46" : "var(--odoo-text)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              animation: "toastIn 0.25s ease both",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
