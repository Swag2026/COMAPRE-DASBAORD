import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "../api/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function TopBar() {
  const { username, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="topbar">
      <button className="menu-toggle" aria-label={t("openMenu")}><Menu size={18} /></button>
      <div className="topbar-title">
        <h1>
          {t("topBarTitle")}
        </h1>
        <p>
          {username}
        </p>
      </div>
      <div className="topbar-actions">
        <div className="action-group">
          <IconBtn title={t("alerts")}><Bell size={17} /></IconBtn>
          <span className="action-divider" />
          <IconBtn title={t("logout")} danger onClick={logout}><LogOut size={17} /></IconBtn>
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children, title, danger, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`icon-btn${danger ? " danger" : ""}`}
    >
      {children}
    </button>
  );
}
