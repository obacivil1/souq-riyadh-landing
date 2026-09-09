const SooqOrders = (() => {

  function create(form, pkg, reference) {
    const state = SooqStorage.read();
    const order = {
      id: reference,
      createdAt: new Date().toISOString(),
      package: {
        id: pkg.id,
        name: pkg.name,
        priceSar: pkg.priceSar,
        priceUsd: pkg.priceUsd
      },
      form: {
        fbName: form.fbName,
        adTitle: form.adTitle,
        link: form.link || '',
        email: form.email,
        whatsapp: form.whatsapp || ''
      },
      paypal: {
        status: 'PENDING',
        orderId: null
      },
      adminStatus: 'submitted'
    };
    state.orders.push(order);
    SooqStorage.write(state);
    return order;
  }

  function list() {
    const state = SooqStorage.read();
    return [...state.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function getById(ref) {
    return list().find((o) => o.id === ref) || null;
  }

  function updatePaypal(ref, patch) {
    const state = SooqStorage.read();
    state.orders = state.orders.map((o) => {
      if (o.id === ref) o.paypal = Object.assign({}, o.paypal, patch);
      return o;
    });
    SooqStorage.write(state);
  }

  function updateStatus(ref, adminStatus) {
    const state = SooqStorage.read();
    state.orders = state.orders.map((o) => {
      if (o.id === ref) o.adminStatus = adminStatus;
      return o;
    });
    SooqStorage.write(state);
  }

  function search(query, filter) {
    const q = String(query || '').trim().toLowerCase();
    return list().filter((o) => {
      if (filter && o.adminStatus !== filter) return false;
      if (!q) return true;
      const hay = [
        o.id,
        o.form.fbName,
        o.form.adTitle,
        o.form.email,
        o.form.whatsapp,
        o.form.link,
        o.package.name
      ].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function totals(all) {
    const items = all || list();
    const submitted = items.filter((o) => o.adminStatus === 'submitted');
    const approved = items.filter((o) => o.adminStatus === 'approved');
    const rejected = items.filter((o) => o.adminStatus === 'rejected');
    const refunded = items.filter((o) => o.adminStatus === 'refunded');
    const paid = items.filter((o) => o.paypal.status === 'COMPLETED');
    const revenue = paid.reduce((sum, o) => sum + Number(o.package.priceSar), 0);
    return {
      total: items.length,
      submitted: submitted.length,
      approved: approved.length,
      rejected: rejected.length,
      refunded: refunded.length,
      revenue
    };
  }

  function exportCsv(items) {
    const cols = [
      'المرجع',
      'التاريخ',
      'الباقة',
      'المبلغ (ر.س)',
      'اسم فيسبوك',
      'عنوان الإعلان',
      'الرابط',
      'الإيميل',
      'واتساب',
      'حالة الدفع',
      'حالة الإدارة'
    ];
    const esc = (v) => {
      const s = String(v == null ? '' : v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? '"' + s + '"' : s;
    };
    const rows = items.map((o) =>
      [
        o.id,
        o.createdAt,
        o.package.name,
        o.package.priceSar,
        o.form.fbName,
        o.form.adTitle,
        o.form.link,
        o.form.email,
        o.form.whatsapp,
        o.paypal.status,
        o.adminStatus
      ].map(esc).join(',')
    );
    return '\uFEFF' + [cols.map(esc).join(','), ...rows].join('\n');
  }

  return {
    create,
    list,
    getById,
    updatePaypal,
    updateStatus,
    search,
    totals,
    exportCsv
  };
})();