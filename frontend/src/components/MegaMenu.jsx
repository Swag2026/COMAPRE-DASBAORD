import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, BarChart3, Building2, RefreshCcw, Truck,
  Leaf, FileText, Layers,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    id: 1,
    label: "Stock Views",
    subMenus: [
      {
        title: "Comparison",
        items: [
          { label: "Product Comparison", description: "Total + Branch stock, live from Odoo", icon: BarChart3, to: "/product-comparison" },
        ],
      },
      {
        title: "Structure",
        items: [
          { label: "Branch Stock", description: "Per-branch breakdown & Qty chart", icon: Building2, to: "/product-comparison" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Operations",
    subMenus: [
      {
        title: "Inventory Actions",
        items: [
          { label: "Reorder Suggestions", description: "Critical / Low / OK priority list", icon: RefreshCcw, to: "/reorder" },
          { label: "Pending Transfers", description: "In-progress stock moves", icon: Truck, to: "/transfers" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Planning",
    subMenus: [
      {
        title: "Seasonal",
        items: [
          { label: "Season Comparison", description: "Compare stock across seasons", icon: Leaf, to: "/season-comparison" },
        ],
      },
    ],
  },
];

export default function MegaMenu({ items = NAV_ITEMS }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [isHover, setIsHover] = useState(null);
  const navigate = useNavigate();

  return (
    <ul style={{ position: "relative", display: "flex", alignItems: "center", listStyle: "none", margin: 0, padding: 0, gap: 0 }}>
      {items.map((navItem) => (
        <li
          key={navItem.label}
          style={{ position: "relative" }}
          onMouseEnter={() => setOpenMenu(navItem.label)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            onMouseEnter={() => setIsHover(navItem.id)}
            onMouseLeave={() => setIsHover(null)}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "8px 16px",
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.25s",
            }}
            onFocus={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <span style={{ position: "relative", zIndex: 1 }}>{navItem.label}</span>
            {navItem.subMenus && (
              <ChevronDown
                size={14}
                style={{
                  position: "relative",
                  zIndex: 1,
                  transition: "transform 0.25s",
                  transform: openMenu === navItem.label ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            )}
            {(isHover === navItem.id || openMenu === navItem.label) && (
              <motion.div
                layoutId="mega-hover-bg"
                style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}
              />
            )}
          </button>

          <AnimatePresence>
            {openMenu === navItem.label && navItem.subMenus && (
              <div style={{ position: "absolute", left: 0, top: "100%", paddingTop: 8, zIndex: 50 }}>
                <motion.div
                  layoutId="mega-menu-panel"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    width: "max-content",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#0A0A0A",
                    padding: 16,
                    borderRadius: 16,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                  }}
                >
                  <div style={{ display: "flex", gap: 32 }}>
                    {navItem.subMenus.map((sub) => (
                      <div key={sub.title} style={{ minWidth: 180 }}>
                        <h3 style={{ marginBottom: 12, fontSize: 12, fontWeight: 500, textTransform: "capitalize", color: "rgba(255,255,255,0.45)" }}>
                          {sub.title}
                        </h3>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                          {sub.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <li key={item.label}>
                                <button
                                  onClick={() => { setOpenMenu(null); navigate(item.to); }}
                                  className="mega-item"
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    textAlign: "left",
                                    width: "100%",
                                  }}
                                >
                                  <span
                                    className="mega-icon"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 36,
                                      height: 36,
                                      flexShrink: 0,
                                      borderRadius: 8,
                                      border: "1px solid rgba(255,255,255,0.3)",
                                      color: "#fff",
                                      transition: "background 0.25s, color 0.25s",
                                    }}
                                  >
                                    <Icon size={18} />
                                  </span>
                                  <span>
                                    <span style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#fff" }}>{item.label}</span>
                                    <span className="mega-desc" style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.45)", transition: "color 0.25s" }}>
                                      {item.description}
                                    </span>
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </li>
      ))}
      <style>{`
        .mega-item:hover .mega-icon { background: #fff; color: #0A0A0A; }
        .mega-item:hover .mega-desc { color: #fff; }
      `}</style>
    </ul>
  );
}
