(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const TABS = [
    ['home', 'نظرة عامة'], ['easy', 'الأسعار والشراء'], ['orders', 'الطلبات'], ['users', 'المستخدمين'], ['create', 'إنشاء حساب'],
    ['plans', 'الباقات (متقدم)'], ['pricing', 'أسعار الكريديت (متقدم)'], ['settings', 'الإعدادات (متقدم)'], ['discounts', 'أكواد الخصم'],
    ['gifts', 'أكواد الهدايا'], ['redemptions', 'استخدامات الهدايا'], ['categories', 'الأقسام'], ['presets', 'الاختيارات'],
    ['ledger', 'سجل الكريديت'], ['security', 'سجل الأمان'],
    ['health', 'فحص الخادم والموديلات'], ['secrets', 'الإعدادات السرية'], ['tools', 'تشغيل الدوال']
  ];
  const NOTES = {
    orders: 'وافق على الطلب عشان اللي فيه يتضاف للمستخدم تلقائي وتطلعله فاتورة. الرفض بيرجع استخدام كود الخصم.',
    users: 'اضغط على أي مستخدم عشان تعدل أي بيانات ليه. كلمة السر محفوظة متشفرة (password_hash) ومينفعش حد يعرف الأصلية حتى إحنا، بس تقدر تشوف الشكل المتشفر وتحط كلمة سر جديدة. أي تعديل في الرصيد بيتسجل في سجل الكريديت.',
    ledger: 'سجل مؤقت: الحركة بتتمسح من الشيت بعد 5 دقايق من ما توصل لجهاز المستخدم (والجهاز بيحتفظ بيها). الحركات الجارية (held) بتفضل لحد ما تخلص. التعديل هنا مش بيغير رصيد المستخدم.',
    security: 'سجل الدخول والعمليات الحساسة. تقدر تعدل أو تحذف أي صف.',
    plans: 'days = مدة الباقة بالأيام. join_credits = الكريديت اللي بيتضاف مع الشراء. renew_credits = الكريديت اللي بيتضاف لما رصيد المستخدم يخلص، بعد renew_hours ساعة من وقت ما خلص. video_max_sec = أقصى مدة فيديو (مضاعفات 5 لحد 30). features مفصولة بعلامة |',
    pricing: 'تكلفة كل عملية بالكريديت. active = no يخلي العملية ببلاش (ماعدا الصور والفيديو أقل حاجة 1).',
    settings: 'سعر الكريديت: credit_min بسعر credit_min_price دولار، والشراء بمضاعفات credit_step.',
    discounts: 'value = قيمة الخصم بالدولار. applies_to = all أو plan أو credits أو اسم باقة (مثلاً pro). max_uses = 0 يعني بلا حد. expires_at تاريخ زي 2026-12-31. active = yes لتفعيله.',
    gifts: 'plan + days = باقة مجانية (من غير كريديت الاشتراك). credits = كريديت مجاني. ينفع الاتنين مع بعض. كل مستخدم يستخدم الكود مرة واحدة.',
    categories: 'الأقسام اللي بتظهر في الاستوديو. icon لازم يكون موجود في الموقع وإلا هياخد أيقونة "حر".',
    presets: 'الاختيارات جوه كل قسم. category = id القسم.'
  };
  const LABELS = {
    id: 'المعرف', name: 'الاسم', email: 'البريد', invited_by: 'دعاه', invite_code: 'كود الدعوة', created_at: 'اتعمل', last_used_at: 'آخر دخول', terms_accepted_at: 'وافق على الشروط', plan: 'الباقة', plan_until: 'الباقة لحد', credits: 'كريديت', bonus_credits: 'قديم (بيتجمع في الكريديت)', credits_cycle_at: 'الرصيد خلص من', status: 'الحالة',
    price: 'السعر $', currency: 'العملة', period: 'الفترة', days: 'الأيام', per_minute: 'في الدقيقة', join_credits: 'كريديت الاشتراك', renew_credits: 'الرصيد المتجدد', renew_hours: 'التجديد كل (ساعة)', pro_mode: 'وضع Pro', max_refs: 'أقصى صور مرجعية', video_max_sec: 'أقصى فيديو (ث)', features: 'المميزات', highlight: 'مميزة', active: 'مفعل', order: 'الترتيب',
    key: 'المفتاح', label: 'الوصف', value: 'القيمة', time: 'الوقت', user_id: 'المستخدم', kind: 'النوع', item: 'البند', subtotal: 'السعر', discount_code: 'كود الخصم', discount: 'الخصم', total: 'الإجمالي', region: 'المنطقة', invoice_no: 'الفاتورة', decided_at: 'وقت القرار', note: 'ملاحظة',
    code: 'الكود', applies_to: 'ينطبق على', max_uses: 'أقصى استخدام', used: 'اتستخدم', expires_at: 'ينتهي', details: 'التفاصيل', action: 'العملية', balance_after: 'الرصيد بعدها', split: 'التقسيم', event: 'الحدث', ip: 'IP',
    icon: 'الأيقونة', base_prompt: 'الوصف الأساسي', category: 'القسم', group: 'المجموعة', prompt: 'الوصف'
  };
  const ERR = { forbidden: 'معندكش صلاحية', stale: 'الصف اتغير، حدّث الصفحة وجرب تاني', email_taken: 'البريد ده مستخدم', email_invalid: 'البريد مش صحيح', plan_invalid: 'الباقة مش موجودة', date_invalid: 'التاريخ مش صحيح', key_required: 'لازم تكتب أول خانة (المعرف أو الكود)', key_taken: 'المعرف أو الكود ده موجود قبل كده', already_decided: 'الطلب ده اتاخد فيه قرار قبل كده', user_missing: 'المستخدم مش موجود', name_invalid: 'الاسم مش صحيح', password_weak: 'كلمة السر لازم 8 حروف على الأقل وفيها حروف وأرقام', days_required: 'اكتب عدد أيام الباقة', busy: 'الشيت مشغول، جرب تاني', invalid: 'البيانات مش صحيحة', pass_wrong: 'كلمة سر اللوحة غلط', hash_invalid: 'شكل password_hash مش صحيح، استخدم خانة كلمة سر جديدة بدل ما تعدله بإيدك', run_failed: 'الدالة وقفت بخطأ', secret_short: 'SECRIT لازم 32 حرف على الأقل', unauthorized: 'الجلسة انتهت' };
  const ST = { pending: 'مستني', approved: 'اتوافق', rejected: 'مرفوض' };
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const svg = n => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'ic'); const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#i-' + n); s.append(u); return s; };
  const toast = (t, k) => window.SirbUI.toast(t, k);
  const fmtT = v => /^\d{4}-\d\d-\d\dT/.test(v) ? new Date(v).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }) : v;
  let api, cur = 'home', page = 0, q = '', status = '', data = null, PLANS = [];

  async function call(body) {
    let r;
    try { r = await api('/admin', body); } catch (e) { toast('مفيش اتصال بالخادم', 'err'); throw e; }
    if (r.status === 401 || r.status === 403) { showLogin('الجلسة انتهت، سجل دخول تاني'); throw new Error('unauthorized'); }
    return r.data || {};
  }

  function tabs() {
    const n = $('tabs'); n.textContent = '';
    TABS.forEach(([id, name]) => {
      const a = el('a', id === cur ? 'active' : '', name); a.href = '#' + id; a.dataset.view = id;
      n.append(a);
    });
  }

  async function show() {
    cur = (location.hash.slice(1) || 'home');
    if (!TABS.some(t => t[0] === cur)) cur = 'home';
    page = 0; q = ''; status = cur === 'orders' ? 'pending' : '';
    tabs();
    const v = $('view'); v.textContent = '';
    if (cur === 'home') return home(v);
    if (cur === 'create') return create(v);
    if (cur === 'health') return healthView(v);
    if (cur === 'secrets') return secretsView(v);
    if (cur === 'tools') return toolsView(v);
    if (cur === 'easy') return easyView(v);
    return table(v);
  }

  async function home(v) {
    const st = el('div', 'stats');
    v.append(el('h2', '', 'نظرة عامة'), st);
    ['users', 'today', 'pro', 'pending', 'approved', 'revenue'].forEach(() => st.append(el('div', 'stat sk')));
    const d = await call({ op: 'stats' });
    if (!d.ok) return;
    st.textContent = '';
    [['المستخدمين', d.users], ['اشتركوا النهارده', d.today], ['مشتركين Pro', d.pro], ['طلبات مستنية', d.pending], ['طلبات اتوافق عليها', d.approved], ['الإيرادات', '$' + Number(d.revenue || 0).toFixed(2)]].forEach(([k, x], i) => {
      const c = el('div', 'stat rise'); c.style.setProperty('--d', i * 50 + 'ms'); c.append(el('span', '', k), el('strong', '', String(x))); st.append(c);
    });
    if (d.pending) { const b = el('a', 'btn sm', 'راجع الطلبات المستنية (' + d.pending + ')'); b.href = '#orders'; b.style.marginTop = '16px'; v.append(b); }
  }

  function create(v) {
    v.append(el('h2', '', 'إنشاء حساب من غير كود تحقق'), el('p', 'section-note', 'الحساب بيتعمل على طول ويقدر يدخل بالبريد وكلمة السر دي. الكريديت بيتضاف لرصيده.'));
    const f = el('form', 'create-form'); f.noValidate = true;
    const fld = (label, inp) => { const l = el('label', 'field', label); l.append(inp); f.append(l); return inp; };
    const mk = (t, ph) => { const i = el('input'); i.type = t; if (ph) i.placeholder = ph; return i; };
    const name = fld('الاسم', mk('text', 'مثال: أحمد'));
    const email = fld('البريد', mk('email', 'name@gmail.com')); email.dir = 'ltr';
    const pass = fld('كلمة السر', mk('text', '8 حروف على الأقل فيها أرقام')); pass.dir = 'ltr';
    const plan = el('select'); fld('الباقة', plan);
    const days = fld('أيام الباقة (لو مش Free)', mk('number')); days.value = '30';
    const credits = fld('كريديت هدية', mk('number')); credits.value = '0';
    const btn = el('button', 'btn', 'إنشاء الحساب'); btn.type = 'submit'; f.append(btn);
    const msg = el('p', 'msg');
    v.append(f, msg);
    call({ op: 'list', table: 'plans' }).then(d => { (d.rows || []).forEach(r => { const o = el('option', '', r.v[1] + ' (' + r.v[0] + ')'); o.value = r.v[0]; plan.append(o); }); });
    f.addEventListener('submit', async e => {
      e.preventDefault(); btn.disabled = true; window.SirbUI.msg(msg, 'جاري الإنشاء...', 'info');
      try {
        const d = await call({ op: 'createUser', name: name.value.trim(), email: email.value.trim(), password: pass.value, plan: plan.value, days: Number(days.value) || 0, credits: Number(credits.value) || 0 });
        if (!d.ok) { window.SirbUI.msg(msg, ERR[d.error] || d.error || 'حصلت مشكلة', 'error'); return; }
        window.SirbUI.msg(msg, 'الحساب اتعمل: ' + d.email + ' · كود الدعوة ' + d.inviteCode, 'success');
        f.reset(); days.value = '30'; credits.value = '0';
      } catch (err) { window.SirbUI.msg(msg, 'تعذر الاتصال', 'error'); }
      finally { btn.disabled = false; }
    });
  }

  async function table(v) {
    const name = TABS.find(t => t[0] === cur)[1];
    v.append(el('h2', '', name));
    if (NOTES[cur]) v.append(el('p', 'section-note', NOTES[cur]));
    const bar = el('div', 'toolbar');
    const s = el('label', 'chat-search'); const si = el('input'); si.type = 'search'; si.placeholder = 'بحث'; si.value = q; s.append(svg('search'), si);
    bar.append(s);
    if (cur === 'orders') {
      const sel = el('select', 'pill');
      [['pending', 'المستنية'], ['approved', 'اتوافق عليها'], ['rejected', 'المرفوضة'], ['', 'الكل']].forEach(([k, t]) => { const o = el('option', '', t); o.value = k; if (k === status) o.selected = true; sel.append(o); });
      sel.addEventListener('change', () => { status = sel.value; page = 0; load(); });
      bar.append(sel);
    }
    const ref = el('button', 'icon-btn'); ref.type = 'button'; ref.setAttribute('aria-label', 'تحديث'); ref.append(svg('refresh')); ref.addEventListener('click', () => load());
    const addB = el('button', 'btn sm'); addB.type = 'button'; addB.append(svg('plus'), el('span', '', 'إضافة')); addB.hidden = true;
    addB.addEventListener('click', () => edit(null));
    const cnt = el('span', 'count-tag');
    bar.append(ref, addB, cnt);
    const wrap = el('div', 'tbl-wrap'); const pager = el('div', 'pager');
    v.append(bar, wrap, pager);
    let t; si.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { q = si.value.trim(); page = 0; load(); }, 350); });

    async function load() {
      wrap.textContent = ''; for (let i = 0; i < 4; i++) wrap.append(el('span', 'sk-line'));
      const d = await call({ op: 'list', table: cur, q, status, page });
      if (!d.ok) { wrap.textContent = ''; wrap.append(el('p', 'hint', ERR[d.error] || 'حصلت مشكلة')); return; }
      data = d; if (d.plans) PLANS = d.plans;
      addB.hidden = !d.add;
      cnt.textContent = d.total + ' صف';
      const tb = el('table', 'tbl'); const th = el('thead'); const hr = el('tr');
      if (cur === 'orders') hr.append(el('th', '', 'إجراء'));
      d.headers.forEach(h => hr.append(el('th', '', LABELS[h] || h)));
      th.append(hr); tb.append(th);
      const body = el('tbody');
      d.rows.forEach((r, i) => {
        const tr = el('tr', 'rise'); tr.style.setProperty('--d', Math.min(i, 14) * 25 + 'ms');
        if (cur === 'orders') {
          const td = el('td', 'acts');
          const o = obj(r);
          if (o.status === 'pending') {
            const ok = el('button', 'btn', 'موافقة'); ok.type = 'button';
            const no = el('button', 'btn ghost danger', 'رفض'); no.type = 'button';
            ok.addEventListener('click', e => { e.stopPropagation(); decide(o, true); });
            no.addEventListener('click', e => { e.stopPropagation(); decide(o, false); });
            td.append(ok, no);
          } else td.append(el('span', 'chip ' + (o.status === 'approved' ? 'ok' : 'err'), ST[o.status] || o.status));
          tr.append(td);
        }
        r.v.forEach((c, j) => { const td = el('td', d.headers[j] === 'email' || /_at$|time/.test(d.headers[j]) ? 'en' : '', d.headers[j] === 'status' && ST[c] ? ST[c] : fmtT(c)); td.title = c; tr.append(td); });
        tr.addEventListener('click', () => edit(r));
        body.append(tr);
      });
      tb.append(body);
      wrap.textContent = '';
      if (!d.rows.length) wrap.append(el('p', 'hint center', 'مفيش بيانات'));
      else wrap.append(tb);
      pager.textContent = '';
      const pages = Math.ceil(d.total / 100);
      if (pages > 1) {
        const p = el('button', 'btn sm ghost', 'السابق'); p.disabled = page === 0; p.addEventListener('click', () => { page--; load(); });
        const n = el('button', 'btn sm ghost', 'التالي'); n.disabled = page >= pages - 1; n.addEventListener('click', () => { page++; load(); });
        pager.append(p, el('span', 'tag', (page + 1) + ' / ' + pages), n);
      }
    }
    window.__reload = load;
    load();
  }

  const obj = r => { const o = {}; data.headers.forEach((h, i) => { o[h] = r.v[i]; }); return o; };

  async function decide(o, approve) {
    const note = approve ? '' : (window.prompt('سبب الرفض (اختياري، هيظهر للمستخدم)', '') || '');
    if (approve && !confirm('موافقة على طلب ' + o.email + ' بـ $' + o.total + '؟ اللي في الطلب هيتضاف للحساب على طول.')) return;
    const d = await call({ op: 'decide', order: o.id, approve, note });
    if (!d.ok) { toast(ERR[d.error] || 'حصلت مشكلة', 'err'); return; }
    toast(approve ? 'اتوافق على الطلب، والفاتورة ' + d.order.invoice + ' اتعملت' : 'الطلب اترفض', approve ? 'ok' : 'info');
    window.__reload();
  }

  const BOOL = ['pro_mode', 'highlight', 'active'];
  function edit(r) {
    const dlg = $('editDlg'), f = $('editForm');
    f.textContent = ''; window.SirbUI.msg($('editMsg'), '');
    const editable = data.edit || [];
    const vals = r ? obj(r) : {};
    $('editTitle').textContent = r ? 'تعديل' : 'إضافة جديد';
    const inputs = {};
    data.headers.forEach(h => {
      const can = editable.includes(h);
      if (!r && !can) return;
      const l = el('label', 'field' + (['features', 'prompt', 'base_prompt', 'details', 'note', 'label'].includes(h) ? ' full' : ''));
      l.append(el('span', '', LABELS[h] || h), el('small', 'en', h));
      let inp;
      if (can && BOOL.includes(h)) { inp = el('select'); ['yes', 'no'].forEach(x => { const o = el('option', '', x === 'yes' ? 'نعم (yes)' : 'لا (no)'); o.value = x; inp.append(o); }); inp.value = /^(yes|true|1|نعم)$/i.test(vals[h] || (r ? '' : 'yes')) ? 'yes' : 'no'; }
      else if (can && h === 'status' && cur === 'users') { inp = el('select'); [['active', 'شغال'], ['blocked', 'موقوف']].forEach(([x, t]) => { const o = el('option', '', t); o.value = x; inp.append(o); }); inp.value = vals[h] || 'active'; }
      else if (can && h === 'plan' && PLANS.length) { inp = el('select'); (cur === 'gifts' ? [''] : []).concat(PLANS).forEach(x => { const o = el('option', '', x || '(من غير باقة)'); o.value = x; inp.append(o); }); inp.value = vals[h] || (cur === 'gifts' ? '' : 'free'); }
      else if (['features', 'prompt', 'base_prompt', 'details'].includes(h)) { inp = el('textarea'); inp.value = vals[h] || ''; }
      else { inp = el('input'); inp.value = vals[h] || ''; if (/credits|price|value|days|uses|used|hours|order|minute|refs|sec$/.test(h)) { inp.inputMode = 'decimal'; inp.dir = 'ltr'; } if (/email|code|_at$|^id$|key/.test(h)) inp.dir = 'ltr'; }
      if (h === 'password_hash') { inp.readOnly = true; inp.dir = 'ltr'; l.classList.add('full'); }
      if (!can) { inp.readOnly = true; inp.disabled = inp.tagName === 'SELECT'; }
      inputs[h] = inp; l.append(inp); f.append(l);
    });
    if (cur === 'users' && r) {
      const l = el('label', 'field full'); l.append(el('span', '', 'كلمة سر جديدة (سيبها فاضية لو مش عايز تغيرها)'), el('small', 'en', 'new_password'));
      const np = el('input'); np.type = 'text'; np.dir = 'ltr'; np.autocomplete = 'off'; np.placeholder = '8 حروف على الأقل فيها حروف وأرقام';
      l.append(np); f.append(l); inputs.new_password = np;
    }
    $('editSave').hidden = !editable.length;
    $('editDel').hidden = !(r && data.del);
    $('editSave').onclick = async () => {
      const values = {};
      Object.keys(inputs).forEach(h => { if (editable.includes(h) && h !== 'password_hash') values[h] = inputs[h].value; });
      if (inputs.new_password && inputs.new_password.value) values.new_password = inputs.new_password.value;
      $('editSave').disabled = true;
      try {
        const d = await call(r ? { op: 'save', table: cur, row: r.r, key: r.v[0], values } : { op: 'add', table: cur, values });
        if (!d.ok) { window.SirbUI.msg($('editMsg'), ERR[d.error] || d.error || 'حصلت مشكلة', 'error'); return; }
        toast(values.new_password ? 'اتحفظ، وكلمة السر الجديدة اتشفرت واتسجلت' : 'اتحفظ', 'ok'); dlg.close(); window.__reload();
      } finally { $('editSave').disabled = false; }
    };
    $('editDel').onclick = async () => {
      if (!confirm('متأكد إنك عايز تحذف الصف ده نهائياً؟')) return;
      const d = await call({ op: 'del', table: cur, row: r.r, key: r.v[0] });
      if (!d.ok) { window.SirbUI.msg($('editMsg'), ERR[d.error] || 'حصلت مشكلة', 'error'); return; }
      toast('اتحذف', 'ok'); dlg.close(); window.__reload();
    };
    if (!dlg.open) dlg.showModal();
  }

  // ---------- easy prices & shop ----------
  const EASY_PLAN = [['name', 'الاسم'], ['price', 'السعر $'], ['days', 'المدة (يوم)'], ['join_credits', 'كريديت الاشتراك'], ['renew_credits', 'الرصيد المتجدد'], ['renew_hours', 'التجديد بعد (ساعة)'], ['active', 'مفعلة']];
  async function easyView(v) {
    v.append(el('h2', '', 'الأسعار والشراء'), el('p', 'section-note', 'غيّر الرقم واضغط حفظ جنب الصف. التعديل بيوصل للموقع خلال دقيقة.'));
    const view = cur;
    const load = t => call({ op: 'list', table: t, page: 0 });
    const [pl, pr, st] = await Promise.all([load('plans'), load('pricing'), load('settings')]);
    if (cur !== view) return;
    const row = (table, d, r, fields, title) => {
      const o = {}; d.headers.forEach((h, i) => { o[h] = r.v[i]; });
      const card = el('div', 'easy-row');
      if (title) card.append(el('b', 'easy-title', title(o)));
      const ins = {};
      fields.forEach(([h, lab]) => {
        const l = el('label', 'field'); l.append(el('span', '', lab));
        let inp;
        if (h === 'active') { inp = el('select'); [['yes', 'نعم'], ['no', 'لا']].forEach(([x, t]) => { const op = el('option', '', t); op.value = x; inp.append(op); }); inp.value = /^(yes|true|1|نعم)$/i.test(o[h]) ? 'yes' : 'no'; }
        else { inp = el('input'); inp.value = o[h] || ''; if (h !== 'name' && h !== 'value' || /^\d/.test(o[h] || '')) { inp.inputMode = 'decimal'; inp.dir = 'ltr'; } }
        ins[h] = inp; l.append(inp); card.append(l);
      });
      const b = el('button', 'btn sm', 'حفظ'); b.type = 'button';
      b.addEventListener('click', async () => {
        const values = {}; Object.keys(ins).forEach(h => { values[h] = ins[h].value.trim(); });
        b.disabled = true;
        try {
          const x = await call({ op: 'save', table, row: r.r, key: r.v[0], values });
          if (!x.ok) { toast(ERR[x.error] || 'حصلت مشكلة', 'err'); return; }
          toast('اتحفظ', 'ok');
        } finally { b.disabled = false; }
      });
      card.append(b);
      return card;
    };
    const sec = (title, note) => { const s = el('section', 'easy-sec'); s.append(el('h3', '', title)); if (note) s.append(el('p', 'hint', note)); v.append(s); return s; };
    if (pl.ok && pl.rows) { const s = sec('الباقات', 'السعر بالدولار. الرصيد المتجدد بيتضاف لما رصيد المستخدم يخلص وبعد عدد الساعات.'); pl.rows.forEach(r => s.append(row('plans', pl, r, EASY_PLAN, o => o.id))); }
    if (pr.ok && pr.rows) { const s = sec('تكلفة العمليات بالكريديت'); pr.rows.forEach(r => s.append(row('pricing', pr, r, [['credits', 'الكريديت'], ['active', 'مفعل']], o => o.label || o.key))); }
    if (st.ok && st.rows) { const s = sec('الشراء وإعدادات المتجر', 'سعر الكريديت الواحد = سعر أقل عدد ÷ أقل عدد. المستخدم يقدر يشتري أي عدد من أقل عدد وطالع (مثلاً 51).'); st.rows.filter(r => r.v[0] !== 'credit_step').forEach(r => s.append(row('settings', st, r, [['value', 'القيمة']], o => o.label || o.key))); }
  }

  // ---------- password confirm ----------
  function askPass(title, note, word) {
    return new Promise(res => {
      const d = $('passDlg');
      $('passTitle').textContent = title; $('passNote').textContent = note || '';
      $('passIn').value = ''; $('confirmIn').value = ''; window.SirbUI.msg($('passMsg'), '');
      $('confirmWrap').hidden = !word; $('confirmLbl').textContent = word ? 'للتأكيد اكتب ' + word : '';
      let done = false;
      const fin = v => { if (done) return; done = true; d.close(); res(v); };
      $('passForm').onsubmit = e => {
        e.preventDefault();
        const p = $('passIn').value;
        if (!p) { window.SirbUI.msg($('passMsg'), 'اكتب كلمة السر', 'error'); return; }
        if (word && $('confirmIn').value.trim() !== word) { window.SirbUI.msg($('passMsg'), 'اكتب ' + word + ' بالظبط عشان تأكد', 'error'); return; }
        fin(p);
      };
      d.querySelectorAll('[data-pclose]').forEach(b => { b.onclick = () => fin(null); });
      d.onclose = () => fin(null);
      d.showModal(); $('passIn').focus();
    });
  }

  // ---------- health ----------
  const HNAME = { SHET_URL: 'رابط الشيت في الخادم', SECRIT: 'المفتاح السري في الخادم', ALLOW: 'المواقع المسموحة (ALLOW)', AI: 'Cloudflare (تحسين الوصف والترجمة)', sheet_link: 'الاتصال بالشيت', schema: 'إصدار الجداول', 'prop:SECRIT': 'SECRIT في الشيت', 'prop:OTP1': 'OTP1 (إرسال الأكواد)', 'prop:OTP_FROM': 'OTP_FROM (اسم المرسل)', 'prop:flux1-api': 'مفتاح flux1-api (الصور المجانية)', 'prop:flux2-api': 'مفتاح flux2-api (صور Pro)', 'prop:wan-api': 'مفتاح wan-api (الفيديو)', panel: 'بيانات دخول اللوحة (ss)', mail_quota: 'رصيد الإيميلات النهارده', text: 'موديل تحسين الوصف', translate: 'موديل الترجمة', flux1: 'FLUX.1-dev (مجاني)', flux2: 'FLUX.2-dev (Pro)', wan: 'Wan (الفيديو)' };
  function hRow(c) {
    const r = el('div', 'h-row');
    const name = HNAME[c.k] || (c.k.indexOf('sheet:') === 0 ? 'ورقة ' + c.k.slice(6) : c.k);
    const left = el('div', 'h-name'); left.append(el('strong', '', name));
    if (c.model) left.append(el('small', 'en', c.model));
    const info = el('span', 'h-note en', [c.note, c.ms != null ? c.ms + 'ms' : ''].filter(Boolean).join(' · '));
    r.append(el('span', 'chip ' + (c.ok ? 'ok' : 'err'), c.ok ? 'شغال' : 'فيه مشكلة'), left, info);
    return r;
  }
  function healthView(v) {
    v.append(el('h2', '', 'فحص الخادم والموديلات'), el('p', 'section-note', 'الفحص العادي بيتأكد من إعدادات الخادم والشيت والجداول. اختار الموديلات اللي عايز تجربها فعلياً، وخلي بالك إن تجربة موديل الصور بتستهلك من حصة Cloudflare اليومية.'));
    const opts = el('div', 'h-opts');
    const box = (k, label, on) => { const l = el('label', 'h-opt'); const c = el('input'); c.type = 'checkbox'; c.value = k; c.checked = on; l.append(c, el('span', '', label)); opts.append(l); return c; };
    const boxes = [box('text', 'موديل تحسين الوصف', true), box('translate', 'موديل الترجمة', true), box('flux1', 'مفتاح flux1-api (الصور المجانية)', true), box('flux2', 'مفتاح flux2-api (صور Pro)', true), box('wan', 'مفتاح wan-api (الفيديو)', true)];
    const btn = el('button', 'btn', ''); btn.type = 'button'; btn.append(svg('pulse'), document.createTextNode('ابدأ الفحص'));
    const out = el('div', 'h-out');
    v.append(opts, btn, out);
    btn.addEventListener('click', async () => {
      btn.disabled = true; out.textContent = ''; for (let i = 0; i < 5; i++) out.append(el('span', 'sk-line'));
      const t = Date.now();
      try {
        const d = await call({ op: 'health', deep: boxes.filter(b => b.checked).map(b => b.value) });
        out.textContent = '';
        if (!d.ok) { out.append(el('p', 'hint', ERR[d.error] || 'حصلت مشكلة')); return; }
        const all = [].concat(d.worker || [], d.sheet || [], d.models || []);
        const bad = all.filter(c => !c.ok).length;
        out.append(el('p', 'msg ' + (bad ? 'warn' : 'success'), bad ? bad + ' حاجة محتاجة تتظبط · الفحص خد ' + (Date.now() - t) + 'ms' : 'كله شغال · الفحص خد ' + (Date.now() - t) + 'ms'));
        [['الخادم', d.worker], ['الشيت', d.sheet], ['الموديلات', d.models]].forEach(([n, list]) => {
          if (!list || !list.length) return;
          const g = el('section', 'h-group'); g.append(el('h3', '', n)); list.forEach(c => g.append(hRow(c))); out.append(g);
        });
      } catch (_) { out.textContent = ''; out.append(el('p', 'hint', 'الخادم مردش')); }
      finally { btn.disabled = false; }
    });
  }

  // ---------- secrets (Script Properties) ----------
  function secretsView(v) {
    v.append(el('h2', '', 'الإعدادات السرية'), el('p', 'section-note', 'دي Script Properties اللي في الشيت (زي SECRIT و OTP1 و flux1-api و flux2-api و wan-api). عشان تشوفها أو تعدلها لازم تكتب كلمة سر اللوحة. لو غيرت SECRIT لازم تحط نفس القيمة في الخادم وإلا الموقع هيقف.'));
    const wrap = el('div', 'tbl-wrap'); const bar = el('div', 'toolbar');
    const openB = el('button', 'btn sm', ''); openB.type = 'button'; openB.append(svg('eye'), document.createTextNode('اعرض الإعدادات'));
    const addB = el('button', 'btn sm ghost', ''); addB.type = 'button'; addB.append(svg('plus'), document.createTextNode('إضافة')); addB.hidden = true;
    bar.append(openB, addB); v.append(bar, wrap);
    let pass = null;
    const view = cur;
    async function run(body) {
      if (!pass) { pass = await askPass('عرض الإعدادات السرية', 'اكتب كلمة سر اللوحة عشان تفتح الإعدادات السرية.'); if (!pass) return null; }
      const d = await call(Object.assign({ pass }, body));
      if (!d.ok) { if (d.error === 'pass_wrong') pass = null; toast(ERR[d.error] || 'حصلت مشكلة', 'err'); return null; }
      return d;
    }
    function render(list) {
      wrap.textContent = ''; addB.hidden = false; openB.hidden = true;
      const tb = el('table', 'tbl'); const hr = el('tr'); ['المفتاح', 'القيمة', ''].forEach(x => hr.append(el('th', '', x)));
      const th = el('thead'); th.append(hr); tb.append(th); const body = el('tbody');
      list.forEach(p => {
        const tr = el('tr'); const val = el('td', 'en mono', '•'.repeat(Math.min(16, p.v.length || 1))); let shown = false;
        const acts = el('td', 'acts');
        const eye = el('button', 'btn sm ghost', ''); eye.type = 'button'; eye.title = 'إظهار'; eye.append(svg('eye'));
        eye.onclick = e => { e.stopPropagation(); shown = !shown; val.textContent = shown ? p.v : '•'.repeat(Math.min(16, p.v.length || 1)); };
        const cp = el('button', 'btn sm ghost', ''); cp.type = 'button'; cp.title = 'نسخ'; cp.append(svg('copy'));
        cp.onclick = async e => { e.stopPropagation(); try { await navigator.clipboard.writeText(p.v); toast('اتنسخ', 'ok'); } catch (_) { toast('مقدرتش أنسخ', 'err'); } };
        acts.append(eye, cp);
        tr.append(el('td', 'en', p.k), val, acts);
        tr.addEventListener('click', () => editProp(p));
        body.append(tr);
      });
      tb.append(body); wrap.append(tb);
    }
    async function editProp(p) {
      const k = p ? p.k : (window.prompt('اسم المفتاح الجديد (حروف إنجليزي وأرقام و _)', '') || '').trim();
      if (!k) return;
      const nv = window.prompt('القيمة الجديدة لـ ' + k + (p ? '\n(اكتب DELETE عشان تمسحه)' : ''), p ? p.v : '');
      if (nv == null) return;
      const d = nv === 'DELETE' && p ? await run({ op: 'propDel', pk: k }) : await run({ op: 'propSet', pk: k, pv: nv });
      if (d && cur === view) { toast(nv === 'DELETE' ? 'اتمسح' : 'اتحفظ', 'ok'); render(d.props || []); }
    }
    openB.addEventListener('click', async () => { const d = await run({ op: 'props' }); if (d && cur === view) render(d.props || []); });
    addB.addEventListener('click', () => editProp(null));
  }

  // ---------- run setup / reset / dell ----------
  const FNS = [
    ['setup', 'setup', 'بيعمل الجداول الناقصة ويظبط العناوين ويضيف الإعدادات الافتراضية. آمن ومش بيمسح بيانات.', ''],
    ['reset', 'reset', 'بيمسح المستخدمين والطلبات والفواتير وسجل الكريديت والأمان واستخدامات الأكواد. الباقات والأسعار والإعدادات والأكواد والأقسام مش بتتلمس.', 'RESET'],
    ['REMOVE_HES', 'REMOVE_HES', 'بيمسح السجلات بس: سجل الأمان كله، وحركات سجل الكريديت اللي خلصت. المستخدمين والطلبات والأسعار مش بتتلمس.', 'REMOVE'],
    ['dell', 'dell', 'بيمسح كل أوراق الشيت نهائياً (حتى ورقة ss اللي فيها دخول اللوحة). بعدها لازم تشغل setup من الشيت نفسه وتكتب بيانات الدخول من جديد.', 'DELL']
  ];
  function toolsView(v) {
    v.append(el('h2', '', 'تشغيل الدوال'), el('p', 'section-note', 'قبل تشغيل أي دالة لازم تكتب كلمة سر اللوحة تاني. الدوال اللي بتمسح بيانات محتاجة كمان تكتب كلمة تأكيد.'));
    const grid = el('div', 'fn-grid'); const out = el('pre', 'fn-log en'); out.hidden = true;
    FNS.forEach(([fn, name, desc, word]) => {
      const c = el('div', 'fn-card' + (word ? ' danger' : ''));
      c.append(el('h3', 'en', name + '()'), el('p', '', desc));
      const b = el('button', word ? 'btn ghost danger' : 'btn', ''); b.type = 'button'; b.append(svg('play'), document.createTextNode('تشغيل ' + name));
      b.addEventListener('click', async () => {
        const pass = await askPass('تشغيل ' + name, desc, word);
        if (!pass) return;
        b.disabled = true; out.hidden = false; out.textContent = 'جاري تشغيل ' + name + '...';
        try {
          const d = await call({ op: 'run', fn, pass });
          if (!d.ok) { out.textContent = (ERR[d.error] || d.error || 'حصلت مشكلة') + (d.data && d.data.reason ? '\n' + d.data.reason : ''); toast(ERR[d.error] || 'حصلت مشكلة', 'err'); return; }
          out.textContent = name + ' خلصت في ' + d.ms + 'ms\n\n' + (d.log || '(مفيش رسائل)');
          toast(name + ' اشتغلت بنجاح', 'ok');
          if (fn === 'dell') { setTimeout(() => showLogin('الشيت اتمسح. شغل setup من الشيت واكتب بيانات الدخول في ورقة ss.'), 1500); }
        } catch (_) { out.textContent = 'الخادم مردش. ممكن الدالة لسه شغالة، استنى دقيقة واعمل فحص.'; }
        finally { b.disabled = false; }
      });
      c.append(b); grid.append(c);
    });
    v.append(grid, out);
  }

  let started = false;
  function showLogin(m) {
    $('gate').hidden = true; $('shell').hidden = true; $('login').hidden = false;
    $('loginMsg').textContent = '';
    if (m) window.SirbUI.msg($('loginMsg'), m, 'warn');
    $('admUser').focus();
  }
  function open_(user) {
    $('who').textContent = user || '';
    $('login').hidden = true; $('gate').hidden = true; $('shell').hidden = false;
    if (!started) { started = true; window.addEventListener('hashchange', show); }
    show();
  }
  const LERR = { wrong: 'اسم المستخدم أو كلمة السر غلط', locked: 'محاولات كتير غلط، استنى 15 دقيقة', not_set: 'بيانات الدخول مش متسجلة في الشيت (ورقة ss)', invalid: 'اكتب اسم المستخدم وكلمة السر' };

  document.addEventListener('DOMContentLoaded', async () => {
    api = window.SirbApi.api;
    $('editDlg').querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => $('editDlg').close()));
    $('loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const user = $('admUser').value.trim(), pass = $('admPass').value;
      if (!user || !pass) { window.SirbUI.msg($('loginMsg'), LERR.invalid, 'error'); return; }
      const b = $('loginBtn'); b.disabled = true;
      try {
        const r = await api('/admin-login', { user, pass });
        if (r.status === 200 && r.data && r.data.ok) { $('admPass').value = ''; toast('أهلاً بيك في لوحة التحكم', 'ok'); open_(r.data.user); }
        else window.SirbUI.msg($('loginMsg'), LERR[r.data && r.data.error] || 'حصلت مشكلة، جرب تاني', 'error');
      } catch (_) { window.SirbUI.msg($('loginMsg'), 'مفيش اتصال، جرب تاني', 'error'); }
      finally { b.disabled = false; }
    });
    $('admOut').addEventListener('click', async () => { try { await api('/admin-logout', {}); } catch (_) {} $('admUser').value = ''; showLogin(); });
    try {
      const r = await api('/admin', { op: 'whoami' });
      if (r.status === 200 && r.data && r.data.ok) open_(r.data.user); else showLogin();
    } catch (_) { showLogin('مفيش اتصال، جرب تاني'); }
  });
})();
