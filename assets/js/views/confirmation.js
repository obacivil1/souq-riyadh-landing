const ConfirmationView = (() => {
  const cfg = window.RIYADH_CONFIG;

  function successTemplate(order) {
    const done = order.paypal.status === 'COMPLETED';
    return [
      '<div class="container container-narrow confirm-wrap">',
        '<div class="card confirm-card">',
          '<span class="confirm-icon' + (done ? '' : ' warn') + '" aria-hidden="true">' + (done ? '✓' : '⧗') + '</span>',
          '<h1 class="confirm-title">' + (done ? 'تم استلام طلبك بنجاح' : 'سجّلنا طلبك') + '</h1>',
          '<p class="confirm-sub">' + (done ? 'احتفظ بالرقم المرجعي أدناه لمتابعة حالة إعلانك.' : 'احتفظ بالرقم المرجعي أدناه؛ سيُفعَّل إعلانك بعد التحقق من الدفع.') + '</p>',
          '<div class="confirm-ref">',
            '<span id="confirm-ref-value">' + RAU.esc(order.id) + '</span>',
            '<button type="button" class="btn btn-ghost btn-sm" id="copy-ref-btn">نسخ</button>',
          '</div>',
          '<div class="confirm-summary">',
            '<div class="summary-row"><span>الباقة</span><strong>' + RAU.esc(order.package.name) + '</strong></div>',
            '<div class="summary-row"><span>المبلغ</span><strong>' + order.package.priceSar + ' ' + RAU.esc(cfg.currency.label) + '</strong></div>',
            '<div class="summary-row"><span>التاريخ</span><strong>' + RAU.fmtDate(order.createdAt) + '</strong></div>',
            '<div class="summary-row"><span>حالة الدفع</span><strong class="' + (done ? 'status-completed' : 'status-pending') + '">' + (done ? 'مكتمل' : 'منتظر التحقق') + '</strong></div>',
          '</div>',
          '<div class="confirm-note">' + RAU.esc(cfg.policy.guaranteeNote) + '</div>',
          '<div class="confirm-note refund">' + RAU.esc(cfg.policy.refundNote) + '</div>',
        '</div>',
        '<div class="card confirm-next">',
          '<h2>ماذا يحدث بعدها؟</h2>',
          '<ol class="steps">',
            '<li><span class="step-num">1</span><p>يتأكد المشرف من وصول الدفعة إلى حساب الجروب في PayPal.</p></li>',
            '<li><span class="step-num">2</span><p>تتم المطابقة بين الدفع واسم فيسبوك أو عنوان الإعلان في لوحة الإدارة.</p></li>',
            '<li><span class="step-num">3</span><p>في حال القبول يُنشر إعلانك وفق سياسة الجروب وبما لا يخالف سياسة النشر على فيسبوك، وإلا فتُتّبع سياسة الرفض المعلنة.</p></li>',
          '</ol>',
          '<a class="btn btn-ghost btn-block" href="#/">العودة إلى الرئيسية</a>',
        '</div>',
      '</div>'
    ].join('');
  }

  function notFoundTemplate() {
    return [
      '<div class="container container-narrow confirm-wrap">',
        '<div class="card confirm-card">',
          '<span class="confirm-icon warn" aria-hidden="true">?</span>',
          '<h1 class="confirm-title">لم نجد الطلب</h1>',
          '<p class="confirm-sub">تأكد من الرابط أو عد إلى الصفحة الرئيسية لبدء طلب جديد.</p>',
          '<a class="btn btn-primary btn-block confirm-cta" href="#/">العودة إلى الرئيسية</a>',
        '</div>',
      '</div>'
    ].join('');
  }

  function render(container, params) {
    let reference = params.ref || '';
    if (!reference) {
      reference = sessionStorage.getItem(cfg.storage.pendingRefKey) || '';
      sessionStorage.removeItem(cfg.storage.pendingRefKey);
    }
    const order = reference ? SooqOrders.getById(reference) : null;
    if (!order) {
      container.innerHTML = notFoundTemplate();
      return;
    }
    container.innerHTML = successTemplate(order);
    const copyBtn = container.querySelector('#copy-ref-btn');
    if (copyBtn) copyBtn.addEventListener('click', () => RAU.copyText(order.id));
  }

  return { render };
})();