window.RIYADH_CONFIG = {
  brand: 'سوق الرياض',
  tagline: 'صفحة رسوم نشر الإعلانات الرسمية',

  packages: [
    {
      id: 'single',
      name: 'إعلان فردي',
      desc: 'للأفراد والعائلات الراغبين في الإعلان عن منتج أو عرض شخصي.',
      priceSar: 40,
      priceUsd: '10.67',
      popular: false
    },
    {
      id: 'business',
      name: 'إعلان تجاري',
      desc: 'للأعمال والمتاجر والخدمات التجارية الراغبة في إعلان موسّع.',
      priceSar: 80,
      priceUsd: '21.33',
      popular: true
    }
  ],

  currency: {
    code: 'SAR',
    label: 'ريال سعودي'
  },

  policy: {
    reviewHours: 12,
    privacy: [
      'لا نطلب أي بيانات مالية حساسة؛ الدفع يتم بالكامل عبر PayPal بأمان.',
      'نحتفظ فقط ببيانات نموذج الطلب (اسم فيسبوك، عنوان الإعلان، الإيميل) لإتمام المراجعة والمطابقة.',
      'لا نشارك بياناتك مع أي طرف ثالث خارج عملية مراجعة الإعلان.',
      'بيانات النموذج لا تُستخدم كقناة مراسلة أو لأغراض تسويقية.'
    ],
    acceptance: [
      'الدفع يغطي رسوم مراجعة الطلب وإدراجه وفق شروط الجروب، ولا يُعد ضمانًا للنشر.',
      'القبول النهائي خاضع لسياسة الجروب، شريطة أن يكون محتوى الإعلان غير مخالف لسياسة النشر ومعايير المجتمع على فيسبوك.',
      'تُطابق الإدارة الدفع مع اسم فيسبوك أو عنوان الإعلان قبل اتخاذ القرار، وتتحقق من التزام الإعلان بمعايير النشر المنشورة.',
      'في حال الرفض وفق سياسة الجروب أو لمخالفة الإعلان لسياسة النشر على فيسبوك، تُعاد الرسوم كاملةً إلى الحساب أو البطاقة التي دفعت منها، دون أي اقتطاع، ويُبلَّغ المتقدّم وفق ما تراه الإدارة داخل الجروب.'
    ],
    guaranteeNote: 'الدفع لا يضمن النشر، والقبول النهائي خاضع لسياسة الجروب واشتراط عدم مخالفة الإعلان لسياسة النشر على فيسبوك — وفي حال الرفض تُعاد الرسوم كاملة إلى الحساب أو البطاقة التي دفعت منها.',
    refundNote: 'الاسترداد: في حال رفض الإعلان وفق سياسة الجروب، تُعاد الرسوم كاملة إلى الحساب أو البطاقة التي دفعت منها دون أي اقتطاع.',
    highlightTerms: [
      'تُعاد الرسوم كاملة',
      'دون أي اقتطاع',
      'الحساب أو البطاقة التي دفعت منها',
      'الدفع لا يضمن النشر',
      'القبول النهائي خاضع لسياسة الجروب'
    ]
  },

  group: {
    label: 'جروب سوق الرياض على فيسبوك',
    url: '#'
  },

  paypal: {
    mode: 'LINKS',
    links: {
      single: 'https://www.paypal.com/ncp/payment/LD2KGGGYP7W68',
      business: 'https://www.paypal.com/ncp/payment/EFB643C7FW5CG'
    },
    clientId: 'Ab1HP-t7vOAhIVMYGpJ6mttmQlTMb7xnRVvuvs_kobc3AkwOCJn5RwhlVrBbBNXpN1mJ26191p_-TrVj',
    currency: 'USD',
    currencyNote: 'يُحاسَب المبلغ عبر PayPal بالدولار الأمريكي (USD) بقيمة معادلة ثابتة: 40 ريال = 10.67 دولار، و80 ريال = 21.33 دولار. تُودَع الأموال في حساب الجروب مباشرة، ويُتحقق من الدفع قبل النشر. الدفع متاح ببطاقتك البنكية مباشرة أو عبر حساب PayPal، ولا يتطلب امتلاك حساب سابق لدى PayPal.',
    badge: 'PayPal'
  },

  admin: {
    passcode: '@#Mistro987'
  },

  analytics: {
    goatCounterSite: 'souq-riyadh',
    goatCounterToken: 'f64iului9ajh4qa7swunra2z18eby42rq91isobwhrmb3mpho'
  },

  storage: {
    ordersKey: 'souq_riyadh_orders_v1',
    adminSessionKey: 'souq_riyadh_admin_session_v1',
    pendingRefKey: 'souq_riyadh_pending_ref_v1',
    visitsKey: 'souq_riyadh_visits_v1',
    visitSessionKey: 'souq_riyadh_visit_session_v1',
    visitorIdKey: 'souq_riyadh_visitor_id_v1'
  },

  ref: {
    prefix: 'RS'
  }
};