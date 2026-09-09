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
              '<input id="gate-passcode" name="passcode" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" dir="ltr" required>',
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
          '<div class="stat-card"><span class="stat-value" id="stat-total">0</span><span class="stat-label">عدد الطلبات</span></div>',
          '<div class="stat-card"><span class="stat-value" id="stat-submitted">0</span><span class="stat-label">قيد المراجعة</span></div>',
          '<div class="stat-card"><span class="stat-value" id="stat-approved">0</span><span class="stat-label">موافق عليها</span></div>',
          '<div class="stat-card"><span class="stat-value" id="stat-revenue">0</span><span class="stat-label">الإيراد (ر.س)</span></div>',
          '<div class="stat-card"><span class="stat-value" id="stat-visits">0</span><span class="stat-label">زيارات الصفحة</span></div>',
          '<div class="stat-card"><span class="stat-value" id="stat-unique">0</span><span class="stat-label">زوار فريدون</span></div>',
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
        '<p class="admin-hint">طريقة المطابقة: قارن اسم فيسبوك أو عنوان الإعلان مع عملية الدفع في حساب PayPal قبل النشر. المسترد <span id="hint-refunded">0</span> · الزيارات تُحتسب على متصفح هذا الجهاز محليًا.</p>',
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