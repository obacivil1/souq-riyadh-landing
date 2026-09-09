const LandingView = (() => {
  const cfg = window.RIYADH_CONFIG;

  function defaultPkg() {
    return cfg.packages.find((p) => p.popular) || cfg.packages[0];
  }

  function packagesRadios() {
    return cfg.packages.map((p) =>
      '<label class="pkg-card">' +
        '<input type="radio" name="pkg" value="' + RAU.esc(p.id) + '"' + (p.popular ? ' checked' : '') + '>' +
        '<span class="pkg-card-body">' +
          '<span class="pkg-card-head">' +
            '<span class="pkg-name">' + RAU.esc(p.name) + '</span>' +
            (p.popular ? '<span class="pkg-popular">الأكثر طلبًا</span>' : '') +
          '</span>' +
          '<span class="pkg-desc">' + RAU.esc(p.desc) + '</span>' +
          '<span class="pkg-price">' + p.priceSar + ' <span class="pkg-currency">' + RAU.esc(cfg.currency.label) + '</span></span>' +
        '</span>' +
      '</label>'
    ).join('');
  }

  function highlightPolicy(text) {
    const safe = RAU.esc(text);
    const terms = (cfg.policy.highlightTerms || []).slice().sort((a, b) => b.length - a.length);
    if (!terms.length) return safe;
    const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(terms.map(escapeRe).join('|'), 'g');
    return safe.replace(re, (m) => '<mark>' + m + '</mark>');
  }

  function template() {
    const def = defaultPkg();
    return [
      '<section class="hero">',
        '<div class="container">',
          '<div class="hero-grid">',
            '<div class="hero-copy">',
              '<p class="hero-eyebrow">الخطوة الثانية بعد نشر إعلانك في الجروب</p>',
              '<h1 class="hero-title">' + RAU.esc(cfg.tagline) + '</h1>',
              '<p class="hero-sub">أكمل رسوم نشر إعلانك عبر صفحة رسمية آمنة. نموذج قصير، دفع فوري عبر ' + RAU.esc(cfg.paypal.badge) + '، ومراجعة خلال <strong>' + cfg.policy.reviewHours + ' ساعة</strong>.</p>',
              '<div class="hero-badges">',
                '<span class="badge">دفع آمن عبر ' + RAU.esc(cfg.paypal.badge) + '</span>',
                '<span class="badge">خصوصية كاملة</span>',
                '<span class="badge">نظام رسمي موحّد</span>',
              '</div>',
              '<button type="button" class="btn btn-primary btn-lg hero-cta" data-scroll-to="form">ابدأ الآن</button>',
            '</div>',
            '<div class="hero-card">',
              '<div class="hero-card-total">' + def.priceSar + '<span class="hero-card-cur"> ' + RAU.esc(cfg.currency.label) + '</span></div>',
              '<p class="hero-card-note">تبدأ باقات نشر الإعلان من</p>',
              '<div class="hero-card-items">',
                '<div class="hero-card-item"><span>دفع عبر PayPal</span><span>آمن ومشفّر</span></div>',
                '<div class="hero-card-item"><span>مراجعة الطلب</span><span>خلال ' + cfg.policy.reviewHours + ' ساعة</span></div>',
                '<div class="hero-card-item"><span>إجراء واحد</span><span>بسيط وواضح</span></div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</section>',
      '<section class="section">',
        '<div class="container">',
          '<h2 class="section-title">لماذا تدفع رسوم النشر؟</h2>',
          '<p class="section-lead">رسم بسيط يضمن جودة وترتيب الإعلانات داخل ' + RAU.esc(cfg.brand) + '.</p>',
          '<div class="benefits">',
            '<div class="card benefit">',
              '<span class="benefit-icon">📈</span>',
              '<h3>إعلان منظّم وأوسع وصولًا</h3>',
              '<p>إعلانك يظهر ضمن تدفق رسمي مرتب، يصل لأعضاء الجروب بأسلوب واضح.</p>',
            '</div>',
            '<div class="card benefit">',
              '<span class="benefit-icon">🛡️</span>',
              '<h3>إجراءات رسمية وثابتة</h3>',
              '<p>خطة واحدة شفافة لجميع الأعضاء، بأسعار معلنة من إعداد موحّد.</p>',
            '</div>',
            '<div class="card benefit">',
              '<span class="benefit-icon">⚡</span>',
              '<h3>مراجعة سريعة</h3>',
              '<p>نراجع طلبك خلال ' + cfg.policy.reviewHours + ' ساعة من إتمام الدفع.</p>',
            '</div>',
          '</div>',
        '</div>',
      '</section>',
      '<section class="section section-soft">',
        '<div class="container">',
          '<h2 class="section-title">كيف تعمل العملية؟</h2>',
          '<ol class="steps">',
            '<li><span class="step-num">1</span><p>انشر إعلانك في الجروب كالمعتاد، ثم أكمل نموذج الرسوم أدناه.</p></li>',
            '<li><span class="step-num">2</span><p>اختر الباقة وادفع عبر حسابك في ' + RAU.esc(cfg.paypal.badge) + ' خلال لحظات.</p></li>',
            '<li><span class="step-num">3</span><p>احتفظ بالرقم المرجعي الفريد من صفحة التأكيد.</p></li>',
            '<li><span class="step-num">4</span><p>يُعرض قرار المراجعة وفق سياسة الجروب بعد المطابقة اليدوية للدفع.</p></li>',
          '</ol>',
        '</div>',
      '</section>',
      '<section class="section">',
        '<div class="container">',
          '<h2 class="section-title">الخصوصية والسياسة</h2>',
          '<div class="policy-grid">',
            '<div class="card policy-card">',
              '<h3>🔏 خصوصيتك</h3>',
              '<ul class="policy-list">' + cfg.policy.privacy.map((t) => '<li>' + RAU.esc(t) + '</li>').join('') + '</ul>',
            '</div>',
            '<div class="card policy-card">',
              '<h3>📜 سياسة القبول والرفض</h3>',
              '<ul class="policy-list">' + cfg.policy.acceptance.map((t) => '<li>' + highlightPolicy(t) + '</li>').join('') + '</ul>',
              '<p class="policy-warn">' + highlightPolicy(cfg.policy.guaranteeNote) + '</p>',
            '</div>',
          '</div>',
        '</div>',
      '</section>',
      '<section class="section section-form" id="form">',
        '<div class="container container-narrow">',
          '<div class="card form-card">',
            '<h2 class="section-title form-title">نموذج رسوم النشر</h2>',
            '<p class="form-sub">نموذج قصير جدًا. <strong>الدفع لا يضمن النشر</strong>، والقبول النهائي خاضع لسياسة الجروب واشتراط عدم مخالفة الإعلان لسياسة النشر على فيسبوك.</p>',
            '<form id="order-form" novalidate>',
              '<div class="field">',
                '<label for="f-fbName">اسم حسابك في فيسبوك <span class="req">*</span></label>',
                '<input id="f-fbName" name="fbName" type="text" autocomplete="off" placeholder="مثال: أحمد العتيبي" required>',
                '<p class="field-error" data-error-for="fbName"></p>',
              '</div>',
              '<div class="field">',
                '<label for="f-link">رابط إعلانك في الجروب (يُفضّل إدخاله)</label>',
                '<input id="f-link" name="link" type="url" autocomplete="off" placeholder="الصق رابط منشورك في الجروب…" dir="ltr">',
                '<p class="field-hint">يفحصه المشرف أثناء المراجعة؛ وإن لم يكن متوفرًا تتم المطابقة بالاسم أو عنوان الإعلان.</p>',
                '<p class="field-error" data-error-for="link"></p>',
              '</div>',
              '<div class="field">',
                '<label for="f-adTitle">عنوان الإعلان <span class="req">*</span></label>',
                '<input id="f-adTitle" name="adTitle" type="text" autocomplete="off" placeholder="مثال: عرض مكيفات شارب" required>',
                '<p class="field-error" data-error-for="adTitle"></p>',
              '</div>',
              '<div class="field">',
                '<label for="f-email">الإيميل <span class="req">*</span></label>',
                '<input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" dir="ltr" required>',
                '<p class="field-error" data-error-for="email"></p>',
              '</div>',
              '<div class="field">',
                '<label for="f-whatsapp">رقم واتساب (اختياري)</label>',
                '<input id="f-whatsapp" name="whatsapp" type="tel" autocomplete="off" placeholder="05xxxxxxxx" dir="ltr">',
                '<p class="field-error" data-error-for="whatsapp"></p>',
              '</div>',
              '<fieldset class="field">',
                '<legend>اختر الباقة <span class="req">*</span></legend>',
                '<div class="pkg-grid">' + packagesRadios() + '</div>',
                '<p class="field-error" data-error-for="pkg"></p>',
              '</fieldset>',
              '<div class="pay-box">',
                '<div class="pay-summary" id="pay-summary">',
                  '<span id="pay-pkg-name">' + RAU.esc(def.name) + '</span>',
                  '<span class="pay-total" id="pay-total">' + def.priceSar + ' ' + RAU.esc(cfg.currency.label) + '</span>',
                '</div>',
                '<p class="pay-note">' + RAU.esc(cfg.paypal.currencyNote) + '</p>',
                '<button type="submit" class="btn btn-pay btn-lg btn-block" id="submit-btn">' +
                  'المتابعة إلى الدفع عبر ' + RAU.esc(cfg.paypal.badge) + '</button>',
                '<div class="pay-container" id="pay-container" hidden></div>',
                '<p class="pay-disclaimer">النموذج ليس قناة مراسلة؛ تُستخدم بياناتك فقط لإتمام مراجعة إعلانك.</p>',
              '</div>',
            '</form>',
          '</div>',
        '</div>',
      '</section>'
    ].join('');
  }

  function render(container, params) {
    container.innerHTML = template();
    bind(container);
  }

  function bind(container) {
    const form = container.querySelector('#order-form');
    const radios = form.querySelectorAll('input[name="pkg"]');
    const summaryName = container.querySelector('#pay-pkg-name');
    const summaryTotal = container.querySelector('#pay-total');

    function currentPkg() {
      const checked = form.querySelector('input[name="pkg"]:checked');
      const id = checked ? checked.value : (cfg.packages.find((p) => p.popular) || cfg.packages[0]).id;
      return cfg.packages.find((p) => p.id === id);
    }

    radios.forEach((radio) => {
      radio.addEventListener('change', () => {
        const pkg = currentPkg();
        summaryName.textContent = pkg.name;
        summaryTotal.textContent = pkg.priceSar + ' ' + cfg.currency.label;
      });
    });

    form.addEventListener('submit', handleSubmit);

    const cta = container.querySelector('[data-scroll-to="form"]');
    if (cta) {
      cta.addEventListener('click', (e) => {
        e.preventDefault();
        const target = container.querySelector('#form');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function readForm(form) {
    const value = (name) => {
      const el = form.elements[name];
      return el ? el.value.trim() : '';
    };
    return {
      fbName: value('fbName'),
      link: value('link'),
      adTitle: value('adTitle'),
      email: value('email'),
      whatsapp: value('whatsapp')
    };
  }

  function validate(form) {
    const errEls = form.querySelectorAll('.field-error');
    errEls.forEach((el) => { el.textContent = ''; });
    const set = (name, msg) => {
      if (!msg) return true;
      const el = form.querySelector('[data-error-for="' + name + '"]');
      if (el) el.textContent = msg;
      return false;
    };

    const data = readForm(form);
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\+?[0-9]{1,3}?[0-9\s\-()]{7,17}$/;

    let ok = true;
    if (data.fbName.length < 2) { ok = set('fbName', 'يرجى إدخال اسم حسابك في فيسبوك.') && ok; }
    if (data.adTitle.length < 3) { ok = set('adTitle', 'يرجى إدخال عنوان الإعلان.') && ok; }
    if (!emailRe.test(data.email)) { ok = set('email', 'يرجى إدخال بريد إلكتروني صحيح.') && ok; }
    if (data.whatsapp && !phoneRe.test(data.whatsapp)) { ok = set('whatsapp', 'يرجى إدخال رقم واتساب صحيح أو تركه فارغًا.') && ok; }
    if (data.link) {
      try {
        const url = new URL(data.link);
        if (!/^https?:$/.test(url.protocol)) throw new Error('protocol');
      } catch (e) {
        ok = set('link', 'يرجى إدخال رابط صحيح يبدأ بـ https://') && ok;
      }
    }
    const pkg = form.querySelector('input[name="pkg"]:checked');
    if (!pkg) { ok = set('pkg', 'يرجى اختيار الباقة.') && ok; }
    return ok;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) {
      const bad = form.querySelector('.field-error:not(:empty)');
      const target = bad ? bad.closest('.field') : (document.getElementById('form') || form);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (bad) {
        const inp = bad.closest('.field').querySelector('input');
        if (inp) inp.focus({ preventScroll: true });
      }
      RAU.toast('أكمل الحقول الناقصة — المطلوبة محددة بالأحمر.', 'warning');
      return;
    }

    const pkg = cfg.packages.find((p) => p.id === form.querySelector('input[name="pkg"]:checked').value);
    const reference = RiyadhRef.generate();
    const formData = readForm(form);

    SooqOrders.create(formData, pkg, reference);

    const submitBtn = document.getElementById('submit-btn');
    const payContainer = document.getElementById('pay-container');
    const paySummary = document.getElementById('pay-summary');

    if (PayPalClient.isLinks()) {
      const link = cfg.paypal.links[pkg.id];
      if (!link) {
        RAU.toast('لم يُسجَّل رابط دفع لهذه الباقة بعد.', 'error');
        return;
      }
      setBusy(form, true, 'جارٍ تحويلك إلى PayPal…');
      PayPalClient.startLink({ reference, link });
      return;
    }

    setBusy(form, true);

    const sandbox = !PayPalClient.isMock();
    if (sandbox) {
      paySummary.hidden = true;
      submitBtn.hidden = true;
      payContainer.hidden = false;
    }

    try {
      const result = await PayPalClient.start({
        reference: reference,
        packageName: pkg.name,
        amountUsd: pkg.priceUsd,
        container: payContainer
      });
      SooqOrders.updatePaypal(reference, { status: result.status, orderId: result.orderId });
      Router.navigate('/confirm?ref=' + encodeURIComponent(reference));
    } catch (err) {
      const cancelled = !!(err && err.cancelled);
      SooqOrders.updatePaypal(reference, { status: cancelled ? 'CANCELLED' : 'FAILED' });
      setBusy(form, false);
      payContainer.hidden = true;
      payContainer.innerHTML = '';
      paySummary.hidden = false;
      submitBtn.hidden = false;
      RAU.toast(cancelled ? 'تم إلغاء الدفع، لم يُسجَّل أي طلب.' : 'تعذّر إتمام الدفع. حاول مجددًا.', cancelled ? 'info' : 'error');
    }
  }

  function setBusy(form, busy, label) {
    const btn = document.getElementById('submit-btn');
    btn.disabled = busy;
    btn.textContent = label || (busy ? 'جارٍ الاتصال بـ PayPal…' : 'المتابعة إلى الدفع عبر ' + cfg.paypal.badge);
    if (busy && PayPalClient.isMock()) {
      btn.hidden = true;
    } else if (!busy) {
      btn.hidden = false;
    }
  }

  return { render };
})();