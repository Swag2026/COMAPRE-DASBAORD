import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("swag_token"));
  const [username, setUsername] = useState(() => localStorage.getItem("swag_username"));

  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  // If any request comes back 401, force logout so the user re-enters
  // their password instead of staring at broken pages.
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(uname, password) {
    const { data } = await api.post("/auth/login", { username: uname, password });
    localStorage.setItem("swag_token", data.token);
    localStorage.setItem("swag_username", data.username);
    setToken(data.token);
    setUsername(data.username);
  }

  function logout() {
    localStorage.removeItem("swag_token");
    localStorage.removeItem("swag_username");
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
