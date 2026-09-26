import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("swag_lang") || "ar");

  useEffect(() => {
    localStorage.setItem("swag_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.remove("preload");
    document.documentElement.style.opacity = "1";
  }, [lang]);

  function t(key) {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }

  function toggleLanguage() {
    setLang((l) => (l === "en" ? "ar" : "en"));
  }

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLanguage, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
