const PayPalClient = (() => {
  const cfg = window.RIYADH_CONFIG.paypal;
  let sdkPromise = null;

  function loadSdk() {
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      if (window.paypal && window.paypal.Buttons) {
        resolve(window.paypal);
        return;
      }
      const existing = document.querySelector('script[data-paypal-sdk]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.paypal));
        existing.addEventListener('error', () => reject(new Error('load-failed')));
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(cfg.clientId) +
        '&currency=' + encodeURIComponent(cfg.currency);
      s.dataset.paypalSdk = '1';
      s.onload = () => {
        if (window.paypal && window.paypal.Buttons) resolve(window.paypal);
        else reject(new Error('load-failed'));
      };
      s.onerror = () => reject(new Error('load-failed'));
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  function mockOrderId() {
    return 'MOCK-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  }

  function mockDialog(opts) {
    return new Promise((resolve, reject) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML =
        '<div class="modal-card" role="dialog" aria-modal="true" aria-label="محاكاة الدفع">' +
          '<div class="modal-head">' +
            '<span class="pay-logo">PayPal</span>' +
            '<button type="button" class="modal-close" data-pay-cancel aria-label="إغلاق">×</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<p class="modal-badge">وضع محاكاة ضريبة</p>' +
            '<h3 class="modal-title">تأكيد الدفع التجريبي</h3>' +
            '<p class="modal-desc">هذه نافذة محاكاة للتوضيح فقط ولا تُنفّذ أي عملية مالية حقيقية.</p>' +
            '<div class="modal-amount">' +
              '<span class="modal-amount-label">' + RAU.esc(opts.packageName) + '</span>' +
              '<span class="modal-amount-value">' + opts.amountUsd + ' USD</span>' +
            '</div>' +
            '<div class="modal-actions">' +
              '<button type="button" class="btn btn-primary btn-block" data-pay-confirm>إتمام الدفع التجريبي</button>' +
              '<button type="button" class="btn btn-ghost btn-block" data-pay-cancel>إلغاء</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);

      overlay.querySelectorAll('[data-pay-cancel]').forEach((btn) => {
        btn.addEventListener('click', () => {
          overlay.remove();
          reject({ cancelled: true });
        });
      });
      overlay.querySelector('[data-pay-confirm]').addEventListener('click', () => {
        overlay.remove();
        resolve({ status: 'COMPLETED', orderId: mockOrderId() });
      });
    });
  }

  function sandboxPay(opts, container) {
    return new Promise((resolve, reject) => {
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 45 },
        createOrder: (data, actions) =>
          actions.order.create({
            purchase_units: [
              {
                amount: { value: opts.amountUsd, currency_code: cfg.currency },
                custom_id: opts.reference,
                description: 'رسوم نشر إعلان: ' + opts.packageName
              }
            ]
          }),
        onApprove: (data) => resolve({ status: 'COMPLETED', orderId: data.orderID }),
        onCancel: () => reject({ cancelled: true }),
        onError: (err) => reject(err)
      }).render(container).catch(reject);
    });
  }

  function startLink(opts) {
    sessionStorage.setItem(window.RIYADH_CONFIG.storage.pendingRefKey, opts.reference);
    window.location.href = opts.link;
  }

  async function start(opts) {
    if (cfg.mode === 'MOCK') {
      return mockDialog(opts);
    }
    await loadSdk();
    return sandboxPay(opts, opts.container);
  }

  return {
    start,
    startLink,
    mode: () => cfg.mode,
    isMock: () => cfg.mode === 'MOCK',
    isLinks: () => cfg.mode === 'LINKS',
    isSandbox: () => cfg.mode === 'SANDBOX'
  };
})();