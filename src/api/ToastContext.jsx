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
          insetInlineEnd: 16,
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
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: t.type === "error" ? "#FDECEC" : t.type === "success" ? "#E9F7EC" : "var(--odoo-accent)",
              border: `1px solid ${t.type === "error" ? "var(--odoo-danger)" : t.type === "success" ? "var(--odoo-success)" : "var(--odoo-accent)"}`,
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: 12.5,
              fontWeight: 600,
              color: t.type === "error" ? "#7A1E1E" : t.type === "success" ? "#065F46" : "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
              animation: "toastIn 0.4s var(--odoo-ease-bounce) both",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                background: t.type === "error" ? "var(--odoo-danger)" : t.type === "success" ? "var(--odoo-success)" : "#fff",
              }}
            />
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: scale(.9) translateY(-6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
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
