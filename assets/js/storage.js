const SooqStorage = (() => {
  const key = () => window.RIYADH_CONFIG.storage.ordersKey;

  function read() {
    try {
      const raw = localStorage.getItem(key());
      const data = raw ? JSON.parse(raw) : null;
      if (data && Array.isArray(data.orders)) return data;
      return { orders: [] };
    } catch (e) {
      return { orders: [] };
    }
  }

  function write(state) {
    localStorage.setItem(key(), JSON.stringify(state));
  }

  function clear() {
    localStorage.removeItem(key());
  }

  return { read, write, clear };
})();

const SooqVisits = (() => {
  const cfg = () => window.RIYADH_CONFIG.storage;

  function read() {
    try {
      const raw = localStorage.getItem(cfg().visitsKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function write(value) {
    localStorage.setItem(cfg().visitsKey, JSON.stringify(value));
  }

  function record() {
    const now = Date.now();
    let value = read() || { total: 0, unique: 0, firstVisit: now, lastVisit: now };
    value.lastVisit = now;
    if (sessionStorage.getItem(cfg().visitSessionKey)) {
      write(value);
      return value;
    }
    sessionStorage.setItem(cfg().visitSessionKey, '1');
    value.total += 1;
    if (!localStorage.getItem(cfg().visitorIdKey)) {
      localStorage.setItem(cfg().visitorIdKey, 'v' + Math.random().toString(36).slice(2, 10));
      value.unique += 1;
    }
    write(value);
    return value;
  }

  return { record, read };
})();