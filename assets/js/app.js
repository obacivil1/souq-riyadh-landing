const RAU = {
  esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[c]);
  },
  fmtDate(iso) {
    try {
      return new Date(iso).toLocaleString('ar-SA-u-ca-gregory-nu-latn', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return iso;
    }
  },
  copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => RAU.toast('تم نسخ الرقم المرجعي.', 'success'),
        () => RAU.toast('تعذّر النسخ تلقائيًا.', 'error')
      );
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      RAU.toast('تم نسخ الرقم المرجعي.', 'success');
    } catch (e) {
      RAU.toast('تعذّر النسخ تلقائيًا.', 'error');
    }
    ta.remove();
  },
  download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  toast(message, type) {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.className = 'toast-root';
      document.body.appendChild(root);
    }
    const el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'info');
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => el.classList.add('is-showing'), 10);
    setTimeout(() => {
      el.classList.remove('is-showing');
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }
};

const Views = {
  '/': LandingView,
  '/confirm': ConfirmationView,
  '/admin': AdminView
};

function initAnalytics() {
  const site = window.RIYADH_CONFIG.analytics.goatCounterSite;
  if (!site) return;
  const s = document.createElement('script');
  s.dataset.goatcounter = 'https://' + site + '.goatcounter.com/count';
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  document.head.appendChild(s);
}

const App = (() => {
  const appEl = document.getElementById('app');
  return {
    run() {
      initAnalytics();
      SooqVisits.record();
      Router.run((path, query) => {
        const view = Views[path] || Views['/'];
        appEl.innerHTML = '';
        view.render(appEl, query);
      });
    }
  };
})();

App.run();