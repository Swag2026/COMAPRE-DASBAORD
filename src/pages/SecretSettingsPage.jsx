import { useEffect, useState } from "react";
import {
  adminLogin,
  clearAdminToken,
  getAdminConfig,
  getAdminToken,
  saveAdminConfig,
  testAdminLogin,
  testAdminSystem,
} from "../api/adminClient";

const SYSTEM_ORDER = ["SWAG", "LAROUCHE", "DIFFC", "FASHIONLIMITS", "STOCK"];

export default function SecretSettingsPage() {
  const [unlocked, setUnlocked] = useState(!!getAdminToken());
  return unlocked ? (
    <SettingsForm onLocked={() => setUnlocked(false)} />
  ) : (
    <PasswordGate onUnlock={() => setUnlocked(true)} />
  );
}

function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(password);
      onUnlock();
    } catch (err) {
      setError(
        err?.response?.status === 401
          ? "Wrong password."
          : err?.response?.data?.detail || "Could not reach the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageWrap}>
      <form onSubmit={submit} style={{ ...card, width: 360, maxWidth: "90vw" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Admin Settings</div>
        <div style={{ fontSize: 12.5, color: "#6B7280", marginBottom: 18 }}>
          Restricted — enter the admin password to edit Odoo credentials.
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          style={fieldStyle}
        />
        {error && <div style={errorBox}>{error}</div>}
        <button type="submit" disabled={loading} style={{ ...primaryBtn, marginTop: 14 }}>
          {loading ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

const emptySystem = { url: "", db: "", user: "", api_key: "" };

function SettingsForm({ onLocked }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [meta, setMeta] = useState({}); // per-system read-only info (masked key etc.)
  const [systems, setSystems] = useState(() =>
    Object.fromEntries(SYSTEM_ORDER.map((k) => [k, { ...emptySystem }]))
  );
  const [login, setLogin] = useState({ url: "", db: "" });
  const [adminPassword, setAdminPassword] = useState("");
  const [testResults, setTestResults] = useState({});
  const [testingKey, setTestingKey] = useState(null);

  const [loginTest, setLoginTest] = useState({ username: "", password: "" });
  const [loginTestResult, setLoginTestResult] = useState(null);
  const [loginTesting, setLoginTesting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminConfig();
        setMeta(data.systems);
        setLogin({ url: data.login.url || "", db: data.login.db || "" });
        setSystems((prev) => {
          const next = { ...prev };
          for (const key of SYSTEM_ORDER) {
            const s = data.systems[key] || {};
            next[key] = {
              url: s.url || "",
              db: s.db || "",
              user: s.user || "",
              api_key: "", // never pre-fill the real key — leave blank = keep unchanged
            };
          }
          return next;
        });
      } catch (err) {
        if (err?.response?.status === 401) {
          clearAdminToken();
          onLocked();
          return;
        }
        setError("Could not load current config.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSystem(key, field, value) {
    setSystems((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    setSavedMsg("");
    setError("");
    try {
      const payload = {
        systems: Object.fromEntries(SYSTEM_ORDER.map((k) => [k, systems[k]])),
        login,
        admin_password: adminPassword,
      };
      const res = await saveAdminConfig(payload);
      setMeta(res.config.systems);
      setSystems((prev) => {
        const next = { ...prev };
        for (const key of SYSTEM_ORDER) next[key] = { ...next[key], api_key: "" };
        return next;
      });
      setAdminPassword("");
      setSavedMsg("Saved. Changes are live immediately — no redeploy needed.");
    } catch (err) {
      setError(err?.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest(key) {
    setTestingKey(key);
    setTestResults((prev) => ({ ...prev, [key]: null }));
    try {
      const res = await testAdminSystem(key);
      setTestResults((prev) => ({ ...prev, [key]: res }));
    } catch {
      setTestResults((prev) => ({ ...prev, [key]: { ok: false, error: "Request failed." } }));
    } finally {
      setTestingKey(null);
    }
  }

  async function handleLoginTest() {
    setLoginTesting(true);
    setLoginTestResult(null);
    try {
      const res = await testAdminLogin({
        url: login.url,
        db: login.db,
        username: loginTest.username,
        password: loginTest.password,
      });
      setLoginTestResult(res);
    } catch {
      setLoginTestResult({ ok: false, error: "Request failed." });
    } finally {
      setLoginTesting(false);
    }
  }

  function handleLock() {
    clearAdminToken();
    onLocked();
  }

  if (loading) return <div style={pageWrap}>Loading…</div>;

  return (
    <div style={{ ...pageWrap, alignItems: "flex-start", padding: "40px 20px" }}>
      <div style={{ width: 720, maxWidth: "100%", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--odoo-display-font)", fontSize: 20, fontWeight: 800 }}>Admin Settings</div>
            <div style={{ fontSize: 12.5, color: "#6B7280" }}>
              Edit Odoo credentials for all systems. Saved changes apply immediately.
            </div>
          </div>
          <button onClick={handleLock} style={secondaryBtn}>Lock</button>
        </div>

        {error && <div style={errorBox}>{error}</div>}
        {savedMsg && <div style={successBox}>{savedMsg}</div>}

        {/* Staff login block */}
        <div style={card}>
          <div style={sectionTitle}>Staff Login (LOGIN_URL / LOGIN_DB)</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
            This is the Odoo instance staff sign in against on the /login screen.
          </div>
          <Row>
            <Field label="URL">
              <input style={fieldStyle} value={login.url}
                onChange={(e) => setLogin((p) => ({ ...p, url: e.target.value }))} placeholder="https://db.swag.com.sa" />
            </Field>
            <Field label="Database">
              <input style={fieldStyle} value={login.db}
                onChange={(e) => setLogin((p) => ({ ...p, db: e.target.value }))} placeholder="swag_db" />
            </Field>
          </Row>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed var(--odoo-border)" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>
              Test a staff login right now
            </div>
            <div style={{ fontSize: 11.5, color: "#6B7280", marginBottom: 8 }}>
              Reproduces exactly what the /login screen does, using the URL/DB above (save them first if you changed them).
            </div>
            <Row>
              <input style={fieldStyle} value={loginTest.username}
                onChange={(e) => setLoginTest((p) => ({ ...p, username: e.target.value }))}
                placeholder="email" />
              <input style={fieldStyle} type="password" value={loginTest.password}
                onChange={(e) => setLoginTest((p) => ({ ...p, password: e.target.value }))}
                placeholder="password" />
              <button onClick={handleLoginTest} disabled={loginTesting} style={secondaryBtn}>
                {loginTesting ? "Testing…" : "Test"}
              </button>
            </Row>
            {loginTestResult && (
              <div style={loginTestResult.ok ? successBox : errorBox}>
                {loginTestResult.ok ? "✓ Login succeeded." : `✗ ${loginTestResult.error || "Failed."}`}
              </div>
            )}
          </div>
        </div>

        {/* Per-system blocks */}
        {SYSTEM_ORDER.map((key) => (
          <div key={key} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={sectionTitle}>{meta[key]?.name || key}</div>
              <button onClick={() => handleTest(key)} disabled={testingKey === key} style={secondaryBtn}>
                {testingKey === key ? "Testing…" : "Test connection"}
              </button>
            </div>
            {testResults[key] && (
              <div style={testResults[key].ok ? successBox : errorBox}>
                {testResults[key].ok ? "✓ Connected." : `✗ ${testResults[key].error || "Failed."}`}
              </div>
            )}
            <Row>
              <Field label="URL">
                <input style={fieldStyle} value={systems[key].url}
                  onChange={(e) => updateSystem(key, "url", e.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Database">
                <input style={fieldStyle} value={systems[key].db}
                  onChange={(e) => updateSystem(key, "db", e.target.value)} />
              </Field>
            </Row>
            <Row>
              <Field label="API user (email)">
                <input style={fieldStyle} value={systems[key].user}
                  onChange={(e) => updateSystem(key, "user", e.target.value)} />
              </Field>
              <Field label={`API key ${meta[key]?.api_key_masked ? `(current: ${meta[key].api_key_masked})` : ""}`}>
                <input style={fieldStyle} type="password" value={systems[key].api_key}
                  onChange={(e) => updateSystem(key, "api_key", e.target.value)}
                  placeholder="Leave blank to keep current key" />
              </Field>
            </Row>
          </div>
        ))}

        {/* Admin password rotation */}
        <div style={card}>
          <div style={sectionTitle}>Change this page's password</div>
          <input style={{ ...fieldStyle, maxWidth: 320 }} type="password" value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Leave blank to keep the current admin password" />
        </div>

        <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, width: 200 }}>
          {saving ? "Saving…" : "Save all changes"}
        </button>
      </div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

const pageWrap = {
  minHeight: "100vh",
  background: "var(--odoo-bg, #F0EEEE)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "inherit",
};

const card = {
  background: "#fff",
  border: "1px solid var(--odoo-border, #E7E3E3)",
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
};

const sectionTitle = { fontFamily: "var(--odoo-display-font)", fontSize: 14.5, fontWeight: 800, marginBottom: 10 };

const fieldStyle = {
  width: "100%",
  height: 38,
  padding: "0 12px",
  border: "1px solid var(--odoo-border-strong, #C7C1C1)",
  borderRadius: 10,
  fontSize: 13,
  background: "#fff",
  boxSizing: "border-box",
  transition: "border-color .2s ease, box-shadow .2s ease",
};

const primaryBtn = {
  height: 40,
  padding: "0 20px",
  background: "var(--odoo-accent, #0a0a0a)",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 13.5,
  cursor: "pointer",
  transition: "transform .25s var(--odoo-ease-bounce), background .18s ease",
};

const secondaryBtn = {
  height: 32,
  padding: "0 14px",
  background: "#fff",
  color: "#2C2C2C",
  border: "1px solid var(--odoo-border-strong, #C7C1C1)",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 12.5,
  cursor: "pointer",
  transition: "transform .25s var(--odoo-ease-bounce), background .18s ease",
};

const errorBox = {
  background: "#FDECEC",
  color: "#A93226",
  fontSize: 12.5,
  padding: "8px 14px",
  borderRadius: 999,
  marginTop: 10,
  marginBottom: 10,
};

const successBox = {
  background: "#E7F2E8",
  color: "#3D7A4E",
  fontSize: 12.5,
  padding: "8px 14px",
  borderRadius: 999,
  marginTop: 10,
  marginBottom: 10,
};
