const AdminView = (() => {
  const cfg = window.RIYADH_CONFIG;
  const state = {
    query: '',
    filter: ''
  };

  const STATUS_LABEL = {
    submitted: 'قيد المراجعة',
    approved: 'موافق',
    rejected: 'مرفوض',
    refunded: 'مسترد'
  };

  const PAY_STATUS_LABEL = {
    COMPLETED: 'مكتمل',
    PENDING: 'معلّق',
    FAILED: 'فشل',
    CANCELLED: 'ملغي'
  };

  function isUnlocked() {
    return sessionStorage.getItem(cfg.storage.adminSessionKey) === '1';
  }

  function setUnlocked(value) {
    if (value) sessionStorage.setItem(cfg.storage.adminSessionKey, '1');
    else sessionStorage.removeItem(cfg.storage.adminSessionKey);
  }

  function render(container, params) {
    if (!isUnlocked()) {
      container.innerHTML = gateTemplate();
      bindGate(container);
      return;
    }
    container.innerHTML = panelTemplate();
    bindPanel(container);
    renderTable(container);
  }

  function gateTemplate() {
    return [
      '<div class="container container-narrow admin-gate-wrap">',
        '<div class="card admin-gate">',
          '<div class="gate-icon">&#128274;</div>',
          '<h1 class="gate-title">دخول الإدارة</h1>',
          '<p class="gate-sub">هذه اللوحة مخصصة لإدارة <strong>' + RAU.esc(cfg.brand) + '</strong> فقط.</p>',
          '<form id="gate-form" novalidate>',
            '<div class="field">',
              '<label for="gate-passcode">رمز الدخول</label>',
              '<input id="gate-passcode" name="passcode" type="password" autocomplete="off" placeholder="••••••" dir="ltr" required>',
              '<p class="field-error" id="gate-error"></p>',
            '</div>',
            '<button type="submit" class="btn btn-primary btn-block">دخول</button>',
          '</form>',
          '<a class="btn btn-ghost btn-block" href="#/">العودة إلى الرئيسية</a>',
        '</div>',
      '</div>'
    ].join('');
  }

  function bindGate(container) {
    const form = container.querySelector('#gate-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = container.querySelector('#gate-passcode').value.trim();
      const errorEl = container.querySelector('#gate-error');
      if (value === String(cfg.admin.passcode)) {
        setUnlocked(true);
        render(container, {});
      } else {
        errorEl.textContent = 'رمز الدخول غير صحيح.';
      }
    });
  }

  function panelTemplate() {
    return [
      '<div class="container admin-wrap">',
        '<div class="admin-head">',
          '<div>',
            '<h1 class="admin-title">لوحة الطلبات المدفوعة</h1>',
            '<p class="admin-sub">وافِق يدويًا داخل فيسبوك بعد مطابقة الدفع بحسابك في PayPal. عند الرفض أعد المبلغ من حساب PayPal ثم اضغط «استرداد».</p>',
          '</div>',
          '<div class="admin-actions">',
            '<button type="button" class="btn btn-ghost btn-sm" id="export-csv-btn">تصدير CSV</button>',
            '<button type="button" class="btn btn-ghost btn-sm" id="export-json-btn">تصدير JSON</button>',
            '<button type="button" class="btn btn-ghost btn-sm" id="lock-btn">قفل</button>',
          '</div>',
        '</div>',
        '<div class="admin-stats">',
          '<button type="button" class="stat-card stat-btn" data-stat="total"><span class="stat-value" id="stat-total">0</span><span class="stat-label">عدد الطلبات</span></button>',
          '<button type="button" class="stat-card stat-btn" data-stat="submitted"><span class="stat-value" id="stat-submitted">0</span><span class="stat-label">قيد المراجعة</span></button>',
          '<button type="button" class="stat-card stat-btn" data-stat="approved"><span class="stat-value" id="stat-approved">0</span><span class="stat-label">موافق عليها</span></button>',
          '<button type="button" class="stat-card stat-btn" data-stat="revenue"><span class="stat-value" id="stat-revenue">0</span><span class="stat-label">الإيراد (ر.س)</span></button>',
          '<button type="button" class="stat-card stat-btn" data-stat="visits"><span class="stat-value" id="stat-visits">0</span><span class="stat-label">زيارات الصفحة</span></button>',
          '<button type="button" class="stat-card stat-btn" data-stat="unique"><span class="stat-value" id="stat-unique">0</span><span class="stat-label">زوار فريدون</span></button>',
          '<button type="button" class="stat-card stat-btn" data-stat="gc"><span class="stat-value" id="stat-gc">…</span><span class="stat-label">الزوار الفعليون (GoatCounter)</span></button>',
          '<button type="button" class="stat-card stat-btn" data-stat="locations"><span class="stat-value">🌍</span><span class="stat-label">الدول والمدن</span></button>',
        '</div>',
        '<div class="admin-tools">',
          '<input type="search" id="admin-search" class="admin-search" placeholder="ابحث باسم فيسبوك أو عنوان الإعلان أو المرجع…">',
          '<div class="admin-filters" id="admin-filters">',
            '<button type="button" class="filter-btn is-active" data-filter="">الكل</button>',
            '<button type="button" class="filter-btn" data-filter="submitted">قيد المراجعة</button>',
            '<button type="button" class="filter-btn" data-filter="approved">موافق</button>',
            '<button type="button" class="filter-btn" data-filter="rejected">مرفوض</button>',
            '<button type="button" class="filter-btn" data-filter="refunded">مسترد</button>',
          '</div>',
        '</div>',
        '<p class="admin-hint">طريقة المطابقة: قارن اسم فيسبوك أو عنوان الإعلان مع عملية الدفع في حساب PayPal قبل النشر. المسترد <span id="hint-refunded">0</span> · الزيارات الحقيقية من كل الزوار متاحة في حساب GoatCounter (souq-riyadh)، وهذا العداد المحلي يسجّل الصفحات التي تُفتح على هذا المتصفح.</p>',
        '<div class="card admin-table-card">',
          '<div class="admin-table-scroll">',
            '<table class="admin-table">',
              '<thead><tr>',
                '<th>المرجع</th><th>التاريخ</th><th>الباقة</th><th>المبلغ</th><th>اسم فيسبوك</th><th>عنوان الإعلان</th><th>الإيميل</th><th>واتساب</th><th>الدفع</th><th>الحالة</th><th>إجراءات</th>',
              '</tr></thead>',
              '<tbody id="admin-tbody"></tbody>',
            '</table>',
          '</div>',
          '<p class="admin-empty" id="admin-empty" hidden>لا توجد طلبات مطابقة.</p>',
        '</div>',
        '<div class="modal-backdrop" id="stat-modal" hidden>',
          '<div class="modal-card" role="dialog" aria-modal="true">',
            '<div class="modal-head"><h3 id="stat-modal-title">التفاصيل</h3><button type="button" class="modal-close" id="stat-modal-close" aria-label="إغلاق">×</button></div>',
            '<div class="modal-body" id="stat-modal-body"></div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function bindPanel(container) {
    const search = container.querySelector('#admin-search');
    search.addEventListener('input', () => {
      state.query = search.value;
      renderTable(container);
    });

    container.querySelector('#admin-filters').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      state.filter = btn.dataset.filter;
      container.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderTable(container);
    });

    container.querySelector('#export-csv-btn').addEventListener('click', () => {
      const rows = filteredList();
      RAU.download('souq-riyadh-orders.csv', SooqOrders.exportCsv(rows), 'text/csv;charset=utf-8');
    });

    container.querySelector('#export-json-btn').addEventListener('click', () => {
      const rows = filteredList();
      RAU.download('souq-riyadh-orders.json', JSON.stringify(rows, null, 2), 'application/json;charset=utf-8');
    });

    container.querySelector('#lock-btn').addEventListener('click', () => {
      setUnlocked(false);
      render(container, {});
    });

    container.querySelectorAll('.stat-btn').forEach((btn) => {
      btn.addEventListener('click', () => openStat(container, btn.dataset.stat));
    });

    const modal = container.querySelector('#stat-modal');
    function closeModal() {
      modal.hidden = true;
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === modal.querySelector('#stat-modal-close')) closeModal();
    });
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    const tbody = container.querySelector('#admin-tbody');
    tbody.addEventListener('click', (e) => {
      const approveBtn = e.target.closest('[data-approve]');
      const rejectBtn = e.target.closest('[data-reject]');
      const refundBtn = e.target.closest('[data-refund]');
      const copyBtn = e.target.closest('[data-copy]');
      if (approveBtn) {
        SooqOrders.updateStatus(approveBtn.dataset.approve, 'approved');
        renderTable(container);
        RAU.toast('تمت الموافقة على الطلب.', 'success');
      } else if (rejectBtn) {
        SooqOrders.updateStatus(rejectBtn.dataset.reject, 'rejected');
        renderTable(container);
        RAU.toast('تم رفض الطلب.', 'info');
      } else if (refundBtn) {
        SooqOrders.updateStatus(refundBtn.dataset.refund, 'refunded');
        renderTable(container);
        RAU.toast('تم وضع الطلب كمسترد — أكمِل الاسترداد من حساب PayPal.', 'warning');
      } else if (copyBtn) {
        RAU.copyText(copyBtn.dataset.copy);
      }
    });
  }

  function filteredList() {
    return SooqOrders.search(state.query, state.filter);
  }

  function loadGoatCounter(container) {
    const site = window.RIYADH_CONFIG.analytics.goatCounterSite;
    if (!site || loadGoatCounter.loaded) return;
    loadGoatCounter.loaded = true;
    const el = container.querySelector('#stat-gc');
    fetch('https://' + site + '.goatcounter.com/counter/%2F.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { el.textContent = data.count || '0'; })
      .catch(() => { el.textContent = '—'; });
  }

  function openStat(container, kind) {
    const orders = SooqOrders.list();
    const stats = SooqOrders.totals(orders);
    const sums = {};
    ['submitted', 'approved', 'rejected', 'refunded', 'total'].forEach((k) => {
      const items = k === 'total' ? orders : orders.filter((o) => o.adminStatus === k);
      sums[k] = items.reduce((s, o) => s + Number(o.package.priceSar), 0);
    });
    const usd = (sar) => (Number(sar) / 3.75).toFixed(2);
    const title = container.querySelector('#stat-modal-title');
    const body = container.querySelector('#stat-modal-body');
    const close = () => { container.querySelector('#stat-modal').hidden = true; };

    if (kind === 'revenue') {
      const paid = orders.filter((o) => o.paypal.status === 'COMPLETED');
      const group = (id) => paid.filter((o) => o.package.id === id);
      const rows = [
        ['إعلان فردي', group('single').length, group('single').reduce((s, o) => s + Number(o.package.priceSar), 0)],
        ['إعلان تجاري', group('business').length, group('business').reduce((s, o) => s + Number(o.package.priceSar), 0)]
      ];
      title.textContent = 'تفاصيل الإيراد';
      body.innerHTML =
        '<p class="modal-note">الإيراد يُحتسب من الطلبات المنفَّذة للدفع فقط (PayPal مكتمل).</p>' +
        '<table class="admin-table stat-table">' +
          '<thead><tr><th>الباقة</th><th>عدد</th><th>ر.س</th><th>≈ USD</th></tr></thead><tbody>' +
          rows.map((r) => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + usd(r[2]) + '</td></tr>').join('') +
          '<tr class="stat-total-row"><td>الإجمالي</td><td>' + paid.length + '</td><td>' + stats.revenue + '</td><td>' + usd(stats.revenue) + '</td></tr>' +
          '</tbody></table>' +
        '<p class="modal-note">إجمالي كل الباقات (شامل غير المدفوع): ' + sums.total + ' ر.س.</p>';
      modalShow(container);
      return;
    }

    if (kind === 'locations') {
      title.textContent = 'الدول والمدن';
      body.innerHTML = '<p class="modal-note">جارٍ التحميل…</p><button type="button" class="btn btn-ghost btn-block" data-modal-close>إغلاق</button>';
      modalShow(container);
      loadLocations(container, body, 'country');
      return;
    }

    if (kind === 'visits' || kind === 'unique' || kind === 'gc') {
      const visits = SooqVisits.read() || { total: 0, unique: 0 };
      const gcEl = container.querySelector('#stat-gc');
      const site = cfg.analytics.goatCounterSite;
      const gcLink = site
        ? '<a class="btn btn-primary btn-block" href="https://' + site + '.goatcounter.com/" target="_blank" rel="noopener">فتح لوحة التحليلات في GoatCounter</a>'
        : '';
      title.textContent = 'الزيارات';
      body.innerHTML =
        '<div class="stat-quick">' +
          '<div><span class="stat-value">' + visits.total + '</span><span class="stat-label">على هذا المتصفح</span></div>' +
          '<div><span class="stat-value">' + visits.unique + '</span><span class="stat-label">زوار فريدون محليًا</span></div>' +
          '<div><span class="stat-value">' + (gcEl ? (gcEl.textContent || '—') : '—') + '</span><span class="stat-label">زوار فعليون</span></div>' +
        '</div>' +
        '<p class="modal-note">تفاصيل الزيارات الحقيقية من كل الزوار (جوال أو كمبيوتر، الدولة والمدينة، الصفحات، الأيام والساعات) متاحة في لوحة GoatCounter.</p>' +
        gcLink +
        '<button type="button" class="btn btn-ghost btn-block" data-modal-close>إغلاق</button>';
      modalShow(container);
      return;
    }

    const statusRows = [
      ['submitted', 'قيد المراجعة', stats.submitted, sums.submitted],
      ['approved', 'موافق عليها', stats.approved, sums.approved],
      ['rejected', 'مرفوضة', stats.rejected, sums.rejected],
      ['refunded', 'مستردة', stats.refunded, sums.refunded]
    ];
    const active = (kind === 'total') ? 'الكل' : STATUS_LABEL[kind];
    title.textContent = 'تفاصيل — ' + active;
    body.innerHTML =
      '<table class="admin-table stat-table">' +
        '<thead><tr><th>الحالة</th><th>عدد</th><th>ر.س</th></tr></thead><tbody>' +
        statusRows.map((r) =>
          '<tr' + (r[0] === kind || (kind === 'total' && r[0] === 'total') ? '' : '') + '>' +
            '<td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>').join('') +
        '<tr class="stat-total-row"><td>العدد الكلي</td><td>' + stats.total + '</td><td>' + sums.total + '</td></tr>' +
        '</tbody></table>' +
        '<button type="button" class="btn btn-primary btn-block" data-apply-filter="' + kind + '">عرض هذه الطلبات في الجدول</button>' +
        '<button type="button" class="btn btn-ghost btn-block" data-modal-close>إغلاق</button>';
    modalShow(container);

    body.querySelector('[data-apply-filter]').addEventListener('click', (e) => {
      const filter = e.currentTarget.dataset.applyFilter === 'total' ? '' : e.currentTarget.dataset.applyFilter;
      state.filter = filter;
      container.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.filter === filter));
      renderTable(container);
      close();
    });
  }

  function modalShow(container) {
    const modal = container.querySelector('#stat-modal');
    modal.hidden = false;
    const closeBtn = modal.querySelector('.modal-close');
    const onModalClose = (e) => {
      const btn = e.target.closest('[data-modal-close]');
      if (e.target === modal || e.target === closeBtn || btn) modal.hidden = true;
    };
    modal.addEventListener('click', onModalClose);
  }

  async function loadLocations(container, body, scope, id) {
    const site = cfg.analytics.goatCounterSite;
    const token = cfg.analytics.goatCounterToken;
    const back = scope === 'city' ? '<button type="button" class="btn btn-ghost btn-block" data-back-countries>العودة للدول</button>' : '';
    const closeBtn = '<button type="button" class="btn btn-ghost btn-block" data-modal-close>إغلاق</button>';

    if (!token) {
      body.innerHTML = '<p class="modal-note">لتفعيل الدول والمدن: من لوحة GoatCounter (القائمة العلوية ← اسمك ← <strong>API</strong>) أنشئ رمزاً واملأ الحقل <code>analytics.goatCounterToken</code> في config.js. أرسل لي الرمز وأنا أدرجه لك.</p>' + back + closeBtn;
      return;
    }

    const base = 'https://' + site + '.goatcounter.com/api/v0/stats/locations' + (scope === 'city' ? '/' + encodeURIComponent(id) : '') + '?limit=100';
    try {
      const res = await fetch(base, { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const stats = data.stats || [];
      if (!stats.length) {
        body.innerHTML = '<p class="modal-note">لا توجد زيارات قابلة للتجميع بعد.</p>' + back + closeBtn;
        return;
      }
      const rows = stats.map((s) => {
        if (scope === 'city') {
          return '<tr><td>' + RAU.esc(s.name) + '</td><td>' + s.count + '</td></tr>';
        }
        return '<tr class="loc-row" data-loc-id="' + RAU.esc(s.id) + '"><td>' + RAU.esc(s.name) + '</td><td>' + s.count + '</td></tr>';
      }).join('');
      body.innerHTML =
        '<div class="admin-table-scroll"><table class="admin-table stat-table">' +
          '<thead><tr><th>' + (scope === 'city' ? 'المدينة' : 'الدولة') + '</th><th>الزيارات</th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table></div>' +
        back + closeBtn;
      body.querySelectorAll('.loc-row').forEach((row) => row.addEventListener('click', (e) => {
        loadLocations(container, body, 'city', e.currentTarget.dataset.locId);
      }));
      const bk = body.querySelector('[data-back-countries]');
      if (bk) bk.addEventListener('click', () => loadLocations(container, body, 'country'));
    } catch (err) {
      body.innerHTML = '<p class="modal-note">تعذّر تحميل الدول والمدن (تحقق من رمز API في الإعدادات).</p>' + back + closeBtn;
    }
  }

  function renderTable(container) {
    const rows = filteredList();
    const tbody = container.querySelector('#admin-tbody');
    const empty = container.querySelector('#admin-empty');

    const stats = SooqOrders.totals();
    const visits = SooqVisits.read() || { total: 0, unique: 0 };
    container.querySelector('#stat-total').textContent = stats.total;
    container.querySelector('#stat-submitted').textContent = stats.submitted;
    container.querySelector('#stat-approved').textContent = stats.approved;
    container.querySelector('#stat-revenue').textContent = stats.revenue;
    container.querySelector('#stat-visits').textContent = visits.total;
    container.querySelector('#stat-unique').textContent = visits.unique;
    container.querySelector('#hint-refunded').textContent = stats.refunded;
    loadGoatCounter(container);

    if (!rows.length) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    tbody.innerHTML = rows.map(rowFor).join('');
  }

  function rowFor(o) {
    const id = RAU.esc(o.id);
    return '<tr>' +
      '<td data-label="المرجع"><code class="ref-code">' + id + '</code></td>' +
      '<td data-label="التاريخ">' + RAU.esc(RAU.fmtDate(o.createdAt)) + '</td>' +
      '<td data-label="الباقة">' + RAU.esc(o.package.name) + '</td>' +
      '<td data-label="المبلغ">' + o.package.priceSar + ' ر.س</td>' +
      '<td data-label="اسم فيسبوك">' + RAU.esc(o.form.fbName) + '</td>' +
      '<td data-label="عنوان الإعلان">' + RAU.esc(o.form.adTitle) + '</td>' +
      '<td data-label="الإيميل">' + RAU.esc(o.form.email) + '</td>' +
      '<td data-label="واتساب">' + RAU.esc(o.form.whatsapp || '—') + '</td>' +
      '<td data-label="الدفع"><span class="badge badge-pay badge-' + RAU.esc(o.paypal.status.toLowerCase()) + '">' + RAU.esc(PAY_STATUS_LABEL[o.paypal.status] || o.paypal.status) + '</span></td>' +
      '<td data-label="الحالة"><span class="badge badge-admin badge-' + RAU.esc(o.adminStatus) + '">' + RAU.esc(STATUS_LABEL[o.adminStatus] || o.adminStatus) + '</span></td>' +
      '<td class="row-actions" data-label="إجراءات">' +
        '<button type="button" class="btn btn-sm btn-success" data-approve="' + id + '"' + (o.adminStatus === 'approved' ? ' disabled' : '') + '>موافقة</button>' +
        '<button type="button" class="btn btn-sm btn-danger" data-reject="' + id + '"' + (o.adminStatus === 'rejected' ? ' disabled' : '') + '>رفض</button>' +
        '<button type="button" class="btn btn-sm btn-refund" data-refund="' + id + '"' + (o.adminStatus === 'refunded' ? ' disabled' : '') + '>استرداد</button>' +
        '<button type="button" class="link-btn" data-copy="' + id + '">نسخ المرجع</button>' +
      '</td>' +
      '</tr>';
  }

  return { render };
})();