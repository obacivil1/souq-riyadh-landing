const RiyadhRef = (() => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function random(len) {
    let out = '';
    const list = new Uint32Array(len);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(list);
      for (let i = 0; i < len; i++) out += chars[list[i] % chars.length];
    } else {
      for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  function generate() {
    const prefix = window.RIYADH_CONFIG.ref.prefix;
    const ts = Date.now().toString(36).toUpperCase();
    return prefix + '-' + ts + '-' + random(4);
  }

  return { generate };
})();