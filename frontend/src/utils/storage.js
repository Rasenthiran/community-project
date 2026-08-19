const TOKEN = "hospital_access_token";
const USER = "hospital_user";
export const storage = {
  getToken: () => localStorage.getItem(TOKEN),
  setToken: (v) => localStorage.setItem(TOKEN, v),
  getUser: () => { try { return JSON.parse(localStorage.getItem(USER) || "null"); } catch { return null; } },
  setUser: (v) => localStorage.setItem(USER, JSON.stringify(v)),
  clear: () => { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); },
};
