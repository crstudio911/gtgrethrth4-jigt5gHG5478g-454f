(function() {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const TABS = [
    ["home", "نظرة عامة"],
    ["easy", "الأسعار والشراء"],
    ["orders", "الطلبات"],
    ["users", "المستخدمين"],
    ["create", "إنشاء حساب"],
    ["plans", "الباقات (متقدم)"],
    ["pricing", "أسعار الكريديت (متقدم)"],
    ["settings", "الإعدادات (متقدم)"],
    ["discounts", "أكواد الخصم"],
    ["gifts", "أكواد الهدايا"],
    ["redemptions", "استخدامات الهدايا"],
    ["categories", "الأقسام"],
    ["presets", "الاختيارات"],
    ["ledger", "سجل الكريديت"],
    ["security", "سجل الأمان"],
    ["health", "فحص الخادم والموديلات"],
    ["secrets", "الإعدادات السرية"],
    ["tools", "المنطقة الخطر"]
  ];
  const NOTES = {
    orders: "وافق على الطلب ليُضاف محتواه إلى حساب المستخدم تلقائياً وتُصدر له فاتورة. يعيد الرفض استخدام كود الخصم.",
    users: "اضغط على أي مستخدم لتعديل بياناته. كلمة السر محفوظة بصيغة مشفرة (password_hash) ولا يمكن لأحد معرفة الأصلية حتى نحن، لكن يمكنك عرض الصيغة المشفرة وتعيين كلمة سر جديدة. يُسجّل أي تعديل في الرصيد في سجل الكريديت.",
    ledger: "سجل مؤقت: تُحذف الحركة من الشيت تلقائياً بعد دقيقة من وصولها إلى جهاز المستخدم (ويحتفظ بها الجهاز). تبقى الحركات الجارية (held) حتى تكتمل. لا يؤثر التعديل هنا في رصيد المستخدم. لو حركة اتحفظت عند المستخدم وفضلت في الشيت، احذفها بزر «حذف» جنبها أو بزر «حذف المحفوظ عند المستخدمين».",
    security: "سجل الدخول والعمليات الحساسة. يمكنك تعديل أي صف أو حذفه.",
    plans: "days = مدة الباقة بالأيام. join_credits = الكريديت المضاف عند الشراء. renew_credits = الكريديت المضاف عند نفاد رصيد المستخدم، بعد renew_hours ساعة من وقت نفاده. video_max_sec = أقصى مدة فيديو (مضاعفات 5 حتى 30). features مفصولة بعلامة |",
    pricing: "تكلفة كل عملية بالكريديت. active = no يجعل العملية مجانية (باستثناء الصور والفيديو بحد أدنى 1).",
    settings: "سعر الكريديت: credit_min بسعر credit_min_price دولار، والشراء بمضاعفات credit_step.",
    discounts: "value = قيمة الخصم بالدولار. applies_to اختر من القائمة. max_uses = 0 يعني بلا حد. expires_at اختر التاريخ من التقويم. active = yes لتفعيله.",
    gifts: "plan + days = باقة مجانية (دون كريديت الاشتراك). credits = كريديت مجاني. يمكن الجمع بينهما. يستخدم كل مستخدم الكود مرة واحدة.",
    categories: 'الأقسام التي تظهر في الاستوديو. يجب أن يكون icon موجوداً في الموقع وإلا فستُستخدم أيقونة "حر".',
    presets: "الاختيارات داخل كل قسم. category = id القسم."
  };
  const LABELS = {
    id: "المعرف",
    name: "الاسم",
    email: "البريد",
    invited_by: "دعاه",
    invite_code: "كود الدعوة",
    created_at: "أُنشئ",
    last_used_at: "آخر دخول",
    terms_accepted_at: "وافق على الشروط",
    plan: "الباقة",
    plan_until: "الباقة حتى",
    credits: "كريديت",
    bonus_credits: "قديم (يُضاف إلى الكريديت)",
    credits_cycle_at: "نفد الرصيد منذ",
    status: "الحالة",
    price: "السعر $",
    currency: "العملة",
    period: "الفترة",
    days: "الأيام",
    per_minute: "في الدقيقة",
    join_credits: "كريديت الاشتراك",
    renew_credits: "الرصيد المتجدد",
    renew_hours: "التجديد كل (ساعة)",
    pro_mode: "وضع Pro",
    max_refs: "أقصى صور مرجعية",
    video_max_sec: "أقصى فيديو (ث)",
    features: "المميزات",
    highlight: "مميزة",
    active: "مفعل",
    order: "الترتيب",
    key: "المفتاح",
    label: "الوصف",
    value: "القيمة",
    time: "الوقت",
    user_id: "المستخدم",
    kind: "النوع",
    item: "البند",
    subtotal: "السعر",
    discount_code: "كود الخصم",
    discount: "الخصم",
    total: "الإجمالي",
    region: "المنطقة",
    invoice_no: "الفاتورة",
    decided_at: "وقت القرار",
    note: "ملاحظة",
    code: "الكود",
    applies_to: "ينطبق على",
    max_uses: "أقصى استخدام",
    used: "استُخدم",
    expires_at: "ينتهي",
    details: "التفاصيل",
    action: "العملية",
    balance_after: "الرصيد بعدها",
    split: "التقسيم",
    event: "الحدث",
    ip: "IP",
    icon: "الأيقونة",
    base_prompt: "الوصف الأساسي",
    category: "القسم",
    group: "المجموعة",
    prompt: "الوصف"
  };
  const ERR = { forbidden: "ليست لديك صلاحية", stale: "تغيّر الصف، حدّث الصفحة وحاول مرة أخرى", email_taken: "هذا البريد مستخدم", email_invalid: "البريد غير صحيح", plan_invalid: "الباقة غير موجودة", date_invalid: "التاريخ غير صحيح", key_required: "يجب ملء الخانة الأولى (المعرف أو الكود)", key_taken: "هذا المعرف أو الكود موجود مسبقاً", already_decided: "سبق اتخاذ قرار بشأن هذا الطلب", user_missing: "المستخدم غير موجود", name_invalid: "الاسم غير صحيح", password_weak: "كلمة السر ضعيفة: 8 أحرف على الأقل للمستخدمين و12 لكلمة سر اللوحة، وفيها حروف وأرقام", days_required: "اكتب عدد أيام الباقة", busy: "الشيت مشغول، حاول مرة أخرى", invalid: "البيانات غير صحيحة", pass_wrong: "كلمة سر اللوحة غير صحيحة", hash_invalid: "صيغة password_hash غير صحيحة، استخدم خانة كلمة سر جديدة بدلاً من تعديله يدوياً", run_failed: "توقفت الدالة بسبب خطأ", secret_short: "SECRIT يجب أن يتكون من 32 حرفاً على الأقل", unauthorized: "الجلسة انتهت", rate_limited: "محاولات كثيرة، انتظر قليلاً" };
  const ST = { pending: "قيد الانتظار", approved: "تمت الموافقة", rejected: "مرفوض" };
  const el = (t, c, x) => {
    const e = document.createElement(t);
    if (c) e.className = c;
    if (x != null) e.textContent = x;
    return e;
  };
  const svg = (n) => {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "ic");
    const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttribute("href", "#i-" + n);
    s.append(u);
    return s;
  };
  const toast = (t, k) => window.SirbUI.toast(t, k);
  const fmtT = (v) => /^\d{4}-\d\d-\d\dT/.test(v) ? new Date(v).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" }) : v;
  let api, cur = "home", page = 0, q = "", status = "", data = null, PLANS = [];
  async function call(body) {
    let r;
    const safe = body && (body.op === "list" || body.op === "stats" || body.op === "health");
    for (let i = 0; ; i++) {
      try {
        r = await api("/admin", body);
      } catch (e) {
        if (safe && i < 1) continue;
        toast("تأخر الخادم في الرد، حاول مرة أخرى", "err");
        throw e;
      }
      if (r.status >= 500 && safe && i < 1) {
        await new Promise((x) => setTimeout(x, 800));
        continue;
      }
      break;
    }
    if (r.status >= 500) toast("لم يستجب الخادم بشكل صحيح، حاول مرة أخرى بعد قليل", "err");
    if (r.status === 401 || r.status === 403) {
      showLogin("انتهت الجلسة، سجّل الدخول مرة أخرى");
      throw new Error("unauthorized");
    }
    return r.data || {};
  }
  function tabs() {
    const n = $("tabs");
    n.textContent = "";
    TABS.forEach(([id, name]) => {
      const a = el("a", id === cur ? "active" : "", name);
      a.href = "#" + id;
      a.dataset.view = id;
      n.append(a);
    });
  }
  async function show() {
    cur = location.hash.slice(1) || "home";
    if (!TABS.some((t) => t[0] === cur)) cur = "home";
    page = 0;
    q = "";
    status = cur === "orders" ? "pending" : "";
    tabs();
    const v = $("view");
    v.textContent = "";
    const run = cur === "home" ? home : cur === "create" ? create : cur === "health" ? healthView : cur === "secrets" ? secretsView : cur === "tools" ? toolsView : cur === "easy" ? easyView : table;
    return Promise.resolve().then(() => run(v)).catch((e) => {
      if (e && e.message !== "unauthorized") console.warn("[ SIRB_Ai ] view", cur, e && e.name);
    });
  }
  async function home(v) {
    const st = el("div", "stats");
    v.append(el("h2", "", "نظرة عامة"), st);
    ["users", "today", "pro", "pending", "approved", "revenue"].forEach(() => st.append(el("div", "stat sk")));
    const d = await call({ op: "stats" });
    if (!d.ok) return;
    st.textContent = "";
    [["المستخدمون", Number(d.users || 0)], ["المسجلون اليوم", Number(d.today || 0)], ["مشتركو Pro", Number(d.pro || 0)], ["طلبات قيد الانتظار", Number(d.pending || 0)], ["طلبات مقبولة", Number(d.approved || 0)], ["الإيرادات", "$" + Number(d.revenue || 0).toFixed(2)]].forEach(([k, x], i) => {
      const c = el("div", "stat rise");
      c.style.setProperty("--d", i * 50 + "ms");
      c.append(el("span", "", k), el("strong", "", String(x)));
      st.append(c);
    });
    if (d.pending) {
      const b = el("a", "btn sm", "راجع الطلبات قيد الانتظار (" + d.pending + ")");
      b.href = "#orders";
      b.style.marginTop = "16px";
      v.append(b);
    }
  }
  function create(v) {
    v.append(el("h2", "", "إنشاء حساب دون كود تحقق"), el("p", "section-note", "يُنشأ الحساب فوراً ويمكن للمستخدم الدخول بهذا البريد وكلمة السر. يُضاف الكريديت إلى رصيده."));
    const f = el("form", "create-form");
    f.noValidate = true;
    const fld = (label, inp) => {
      const l = el("label", "field", label);
      l.append(inp);
      f.append(l);
      return inp;
    };
    const mk = (t, ph) => {
      const i = el("input");
      i.type = t;
      if (ph) i.placeholder = ph;
      return i;
    };
    const name = fld("الاسم", mk("text", "مثال: أحمد"));
    const email = fld("البريد", mk("email", "name@gmail.com"));
    email.dir = "ltr";
    const pass = fld("كلمة السر", mk("text", "8 أحرف على الأقل تتضمن أرقاماً"));
    pass.dir = "ltr";
    const plan = el("select");
    fld("الباقة", plan);
    const days = fld("أيام الباقة بالأيام (إن لم تكن Free)", mk("number"));
    days.value = "30";
    days.min = "0";
    days.step = "1";
    const credits = fld("كريديت هدية", mk("number"));
    credits.value = "0";
    const btn = el("button", "btn", "إنشاء الحساب");
    btn.type = "submit";
    f.append(btn);
    const msg = el("p", "msg");
    v.append(f, msg);
    call({ op: "list", table: "plans" }).then((d) => {
      (d.rows || []).forEach((r) => {
        const o = el("option", "", r.v[1] + " (" + r.v[0] + ")");
        o.value = r.v[0];
        plan.append(o);
      });
    });
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      btn.disabled = true;
      window.SirbUI.msg(msg, "جاري الإنشاء...", "info");
      try {
        const d = await call({ op: "createUser", name: name.value.trim(), email: email.value.trim(), password: pass.value, plan: plan.value, days: Number(days.value) || 0, credits: Number(credits.value) || 0 });
        if (!d.ok) {
          window.SirbUI.msg(msg, ERR[d.error] || d.error || "حدثت مشكلة", "error");
          return;
        }
        window.SirbUI.msg(msg, "أُنشئ الحساب: " + d.email + " · كود الدعوة " + d.inviteCode, "success");
        f.reset();
        days.value = "30";
        credits.value = "0";
      } catch (err) {
        window.SirbUI.msg(msg, "تعذر الاتصال", "error");
      } finally {
        btn.disabled = false;
      }
    });
  }
  async function table(v) {
    const name = TABS.find((t2) => t2[0] === cur)[1];
    v.append(el("h2", "", name));
    if (NOTES[cur]) v.append(el("p", "section-note", NOTES[cur]));
    const bar = el("div", "toolbar");
    const s = el("label", "chat-search");
    const si = el("input");
    si.type = "search";
    si.placeholder = "بحث";
    si.value = q;
    s.append(svg("search"), si);
    bar.append(s);
    if (cur === "orders") {
      const sel2 = el("select", "pill");
      [["pending", "قيد الانتظار"], ["approved", "تمت الموافقة عليها"], ["rejected", "المرفوضة"], ["", "الكل"]].forEach(([k, t2]) => {
        const o = el("option", "", t2);
        o.value = k;
        if (k === status) o.selected = true;
        sel2.append(o);
      });
      sel2.addEventListener("change", () => {
        status = sel2.value;
        page = 0;
        load();
      });
      bar.append(sel2);
    }
    const ref = el("button", "icon-btn");
    ref.type = "button";
    ref.setAttribute("aria-label", "تحديث");
    ref.append(svg("refresh"));
    ref.addEventListener("click", () => load());
    const addB = el("button", "btn sm");
    addB.type = "button";
    addB.append(svg("plus"), el("span", "", "إضافة"));
    addB.hidden = true;
    addB.addEventListener("click", () => edit(null));
    const cnt = el("span", "count-tag");
    if (cur === "ledger") {
      const cl = el("button", "btn sm ghost danger");
      cl.type = "button";
      cl.append(el("span", "", "حذف المحفوظ عند المستخدمين"));
      cl.title = "يحذف كل الحركات التي وصلت لأجهزة المستخدمين وبقيت في الشيت. لا يحذف الحركات الجارية.";
      cl.addEventListener("click", async () => {
        if (!confirm("حذف كل الحركات التي حفظها المستخدمون على أجهزتهم من الشيت؟ الحركات الجارية ستبقى، ولن يتغير أي رصيد.")) return;
        cl.disabled = true;
        try {
          const k = await call({ op: "ledgerClean" });
          if (!k.ok) {
            toast(ERR[k.error] || "حدثت مشكلة", "err");
            return;
          }
          toast(k.removed ? "حُذفت " + k.removed + " حركة" : "لا توجد حركات محفوظة متبقية", "ok");
          load();
        } finally {
          cl.disabled = false;
        }
      });
      bar.append(cl);
    }
    bar.append(ref, addB, cnt);
    const wrap = el("div", "tbl-wrap");
    const pager = el("div", "pager");
    v.append(bar, wrap, pager);
    let t;
    si.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        q = si.value.trim();
        page = 0;
        load();
      }, 350);
    });
    async function load() {
      wrap.textContent = "";
      for (let i = 0; i < 4; i++) wrap.append(el("span", "sk-line"));
      const d = await call({ op: "list", table: cur, q, status, page });
      if (!d.ok) {
        wrap.textContent = "";
        wrap.append(el("p", "hint", ERR[d.error] || "حدثت مشكلة"));
        return;
      }
      data = d;
      if (d.plans) PLANS = d.plans;
      if (cur === "categories") CATIDS = (d.rows || []).map((r) => String(r.v[0]));
      if (cur === "presets" && !CATIDS.length) call({ op: "list", table: "categories", page: 0 }).then((c) => {
        CATIDS = (c.rows || []).map((r) => String(r.v[0]));
      }).catch(() => {
      });
      addB.hidden = !d.add;
      cnt.textContent = d.total + " صف";
      const tb = el("table", "tbl");
      const th = el("thead");
      const hr = el("tr");
      if (cur === "orders" || cur === "ledger") hr.append(el("th", "", "إجراء"));
      d.headers.forEach((h) => hr.append(el("th", "", LABELS[h] || h)));
      th.append(hr);
      tb.append(th);
      const body = el("tbody");
      d.rows.forEach((r, i) => {
        const tr = el("tr", "rise");
        tr.style.setProperty("--d", Math.min(i, 14) * 25 + "ms");
        if (cur === "orders") {
          const td = el("td", "acts");
          const o = obj(r);
          if (o.status === "pending") {
            const ok = el("button", "btn", "موافقة");
            ok.type = "button";
            const no = el("button", "btn ghost danger", "رفض");
            no.type = "button";
            ok.addEventListener("click", (e) => {
              e.stopPropagation();
              decide(o, true);
            });
            no.addEventListener("click", (e) => {
              e.stopPropagation();
              decide(o, false);
            });
            td.append(ok, no);
          } else td.append(el("span", "chip " + (o.status === "approved" ? "ok" : "err"), ST[o.status] || o.status));
          tr.append(td);
        }
        if (cur === "ledger") {
          const td = el("td", "acts");
          const o = obj(r);
          if (o.status === "held") td.append(el("span", "chip", "جارية"));
          else {
            const x = el("button", "btn sm ghost danger", "حذف");
            x.type = "button";
            x.addEventListener("click", async (e) => {
              e.stopPropagation();
              if (!confirm("حذف هذه الحركة من الشيت؟ لن يتغير رصيد المستخدم.")) return;
              x.disabled = true;
              try {
                const k = await call({ op: "del", table: "ledger", row: r.r, key: r.v[0] });
                if (!k.ok) {
                  toast(ERR[k.error] || "حدثت مشكلة", "err");
                  return;
                }
                toast("حُذفت الحركة", "ok");
                load();
              } finally {
                x.disabled = false;
              }
            });
            td.append(x);
          }
          tr.append(td);
        }
        r.v.forEach((c, j) => {
          const td = el("td", d.headers[j] === "email" || /_at$|time/.test(d.headers[j]) ? "en" : "", d.headers[j] === "status" && ST[c] ? ST[c] : fmtT(c));
          td.title = c;
          tr.append(td);
        });
        tr.addEventListener("click", () => edit(r));
        body.append(tr);
      });
      tb.append(body);
      wrap.textContent = "";
      if (!d.rows.length) wrap.append(el("p", "hint center", "لا توجد بيانات"));
      else wrap.append(tb);
      pager.textContent = "";
      const pages = Math.ceil(d.total / 100);
      if (pages > 1) {
        const p = el("button", "btn sm ghost", "السابق");
        p.disabled = page === 0;
        p.addEventListener("click", () => {
          page--;
          load();
        });
        const n = el("button", "btn sm ghost", "التالي");
        n.disabled = page >= pages - 1;
        n.addEventListener("click", () => {
          page++;
          load();
        });
        pager.append(p, el("span", "tag", page + 1 + " / " + pages), n);
      }
    }
    window.__reload = load;
    load();
  }
  const obj = (r) => {
    const o = {};
    data.headers.forEach((h, i) => {
      o[h] = r.v[i];
    });
    return o;
  };
  async function decide(o, approve) {
    const note = approve ? "" : window.prompt("سبب الرفض (اختياري، سيظهر للمستخدم)", "") || "";
    if (approve && !confirm("موافقة على طلب " + o.email + " بـ $" + o.total + "؟ سيُضاف محتوى الطلب إلى الحساب فوراً.")) return;
    const d = await call({ op: "decide", order: o.id, approve, note });
    if (!d.ok) {
      toast(ERR[d.error] || "حدثت مشكلة", "err");
      return;
    }
    toast(approve ? "تمت الموافقة على الطلب، والفاتورة " + d.order.invoice + " أُنشئت" : "رُفض الطلب", approve ? "ok" : "info");
    window.__reload();
  }
  const BOOL = ["pro_mode", "highlight", "active"];
  const ICONS = ["free", "personal", "product", "landscape", "food", "arch", "animal", "game", "art"];
  let CATIDS = [];
  const isDate = (h) => /(_at|_until)$/.test(h) || h === "time";
  const isDays = (h) => h === "days";
  const pad = (n) => String(n).padStart(2, "0");
  const toLocal = (v) => {
    const d = new Date(v);
    if (!v || isNaN(d.getTime())) return "";
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
  };
  function sel(list, v) {
    const s = el("select");
    list.forEach(([x, t]) => {
      const o = el("option", "", t);
      o.value = x;
      s.append(o);
    });
    if (v && !list.some(([x]) => x === v)) {
      const o = el("option", "", v);
      o.value = v;
      s.append(o);
    }
    s.value = v;
    return s;
  }
  function edit(r) {
    const dlg = $("editDlg"), f = $("editForm");
    f.textContent = "";
    window.SirbUI.msg($("editMsg"), "");
    const editable = data.edit || [];
    const vals = r ? obj(r) : {};
    $("editTitle").textContent = r ? "تعديل" : "إضافة جديد";
    const inputs = {};
    data.headers.forEach((h) => {
      const can = editable.includes(h);
      if (!r && !can) return;
      const l = el("label", "field" + (["features", "prompt", "base_prompt", "details", "note", "label"].includes(h) ? " full" : ""));
      l.append(el("span", "", LABELS[h] || h), el("small", "en", h));
      let inp;
      if (can && BOOL.includes(h)) {
        inp = el("select");
        ["yes", "no"].forEach((x) => {
          const o = el("option", "", x === "yes" ? "نعم (yes)" : "لا (no)");
          o.value = x;
          inp.append(o);
        });
        inp.value = /^(yes|true|1|نعم)$/i.test(vals[h] || (r ? "" : "yes")) ? "yes" : "no";
      } else if (can && h === "status" && cur === "users") {
        inp = el("select");
        [["active", "يعمل"], ["blocked", "موقوف"]].forEach(([x, t]) => {
          const o = el("option", "", t);
          o.value = x;
          inp.append(o);
        });
        inp.value = vals[h] || "active";
      } else if (can && h === "plan" && PLANS.length) {
        inp = el("select");
        (cur === "gifts" ? [""] : []).concat(PLANS).forEach((x) => {
          const o = el("option", "", x || "(دون باقة)");
          o.value = x;
          inp.append(o);
        });
        inp.value = vals[h] || (cur === "gifts" ? "" : "free");
      } else if (can && h === "applies_to") {
        inp = sel([["all", "كل شيء"], ["credits", "شراء الكريديت فقط"], ["plan", "كل الباقات"]].concat(PLANS.filter((x) => x !== "free").map((x) => [x, "باقة " + x + " فقط"])), vals[h] || "all");
      } else if (can && h === "period") {
        inp = sel([["مجاني", "مجاني"], ["شهرياً", "شهرياً"], ["سنوياً", "سنوياً"], ["أسبوعياً", "أسبوعياً"]], vals[h] || "شهرياً");
      } else if (can && h === "currency") {
        inp = sel([["USD", "دولار (USD)"]], vals[h] || "USD");
      } else if (can && h === "status" && cur === "orders") {
        inp = sel(Object.keys(ST).map((k) => [k, ST[k]]), vals[h] || "pending");
      } else if (can && h === "kind" && cur === "orders") {
        inp = sel([["credits", "كريديت"], ["plan", "باقة"]], vals[h] || "credits");
      } else if (can && h === "region") {
        inp = sel([["world", "باقي العالم"], ["eg", "مصر"]], vals[h] || "world");
      } else if (can && h === "icon") {
        inp = sel(ICONS.map((x) => [x, x]), vals[h] || "free");
      } else if (can && h === "category" && CATIDS.length) {
        inp = sel(CATIDS.map((x) => [x, x]), vals[h] || CATIDS[0]);
      } else if (can && isDate(h)) {
        inp = el("input");
        inp.type = "datetime-local";
        inp.dir = "ltr";
        inp.value = toLocal(vals[h]);
        inp.dataset.date = "1";
        l.append(el("small", "hint", "اتركها فارغة إن لم يوجد تاريخ"));
      } else if (can && isDays(h)) {
        inp = el("input");
        inp.type = "number";
        inp.min = "0";
        inp.step = "1";
        inp.dir = "ltr";
        inp.value = vals[h] || "0";
        inp.dataset.days = "1";
        l.querySelector("span").textContent += " (بالأيام)";
      } else if (["features", "prompt", "base_prompt", "details"].includes(h)) {
        inp = el("textarea");
        inp.value = vals[h] || "";
      } else {
        inp = el("input");
        inp.value = vals[h] || "";
        if (/credits|price|value|days|uses|used|hours|order|minute|refs|sec$/.test(h)) {
          inp.inputMode = "decimal";
          inp.dir = "ltr";
        }
        if (/email|code|_at$|^id$|key/.test(h)) inp.dir = "ltr";
      }
      if (h === "password_hash") {
        inp.readOnly = true;
        inp.dir = "ltr";
        l.classList.add("full");
      }
      if (!can) {
        inp.readOnly = true;
        inp.disabled = inp.tagName === "SELECT";
      }
      inputs[h] = inp;
      l.append(inp);
      f.append(l);
    });
    if (cur === "users" && r) {
      const l = el("label", "field full");
      l.append(el("span", "", "كلمة سر جديدة (اتركها فارغة إن لم ترد تغييرها)"), el("small", "en", "new_password"));
      const np = el("input");
      np.type = "text";
      np.dir = "ltr";
      np.autocomplete = "off";
      np.placeholder = "8 أحرف على الأقل تتضمن حروفاً وأرقاماً";
      l.append(np);
      f.append(l);
      inputs.new_password = np;
    }
    $("editSave").hidden = !editable.length;
    $("editDel").hidden = !(r && data.del);
    $("editSave").onclick = async () => {
      const values = {};
      let bad = "";
      Object.keys(inputs).forEach((h) => {
        if (!editable.includes(h) || h === "password_hash") return;
        const i = inputs[h];
        if (i.dataset.date) {
          if (i.value && isNaN(new Date(i.value).getTime())) bad = 'التاريخ في "' + (LABELS[h] || h) + '" غير صحيح';
          values[h] = i.value ? new Date(i.value).toISOString() : "";
          return;
        }
        if (i.dataset.days) {
          if (!/^\d+$/.test(i.value.trim())) bad = '"' + (LABELS[h] || h) + '" يجب أن يكون عدد الأيام عدداً صحيحاً (0 أو أكثر)';
          values[h] = i.value.trim();
          return;
        }
        values[h] = i.value;
      });
      if (bad) {
        window.SirbUI.msg($("editMsg"), bad, "error");
        return;
      }
      if (inputs.new_password && inputs.new_password.value) values.new_password = inputs.new_password.value;
      $("editSave").disabled = true;
      try {
        const d = await call(r ? { op: "save", table: cur, row: r.r, key: r.v[0], values } : { op: "add", table: cur, values });
        if (!d.ok) {
          window.SirbUI.msg($("editMsg"), ERR[d.error] || d.error || "حدثت مشكلة", "error");
          return;
        }
        toast(values.new_password ? "حُفظ، وشُفّرت كلمة السر الجديدة وسُجّلت" : "حُفظ", "ok");
        dlg.close();
        window.__reload();
      } finally {
        $("editSave").disabled = false;
      }
    };
    $("editDel").onclick = async () => {
      if (!confirm("هل أنت متأكد من حذف هذا الصف نهائياً؟")) return;
      const d = await call({ op: "del", table: cur, row: r.r, key: r.v[0] });
      if (!d.ok) {
        window.SirbUI.msg($("editMsg"), ERR[d.error] || "حدثت مشكلة", "error");
        return;
      }
      toast("حُذف", "ok");
      dlg.close();
      window.__reload();
    };
    if (!dlg.open) dlg.showModal();
  }
  const EASY_PLAN = [["name", "الاسم"], ["price", "السعر $"], ["days", "المدة (يوم)"], ["join_credits", "كريديت الاشتراك"], ["renew_credits", "الرصيد المتجدد"], ["renew_hours", "التجديد بعد (ساعة)"], ["active", "مفعلة"]];
  async function easyView(v) {
    v.append(el("h2", "", "الأسعار والشراء"), el("p", "section-note", "غيّر الرقم واضغط حفظ بجانب الصف. يظهر التعديل في الموقع خلال دقيقة."));
    const view = cur;
    const load = (t) => call({ op: "list", table: t, page: 0 });
    let pl, pr, st;
    try {
      pl = await load("plans");
      pr = await load("pricing");
      st = await load("settings");
    } catch (e) {
      if (cur === view) v.append(el("p", "section-note", "تعذر تحميل البيانات، افتح القسم مرة أخرى."));
      return;
    }
    if (!pl.ok || !pr.ok || !st.ok || !pl.rows || !pr.rows || !st.rows) {
      if (cur === view) v.append(el("p", "section-note", "تعذر تحميل البيانات، افتح القسم مرة أخرى."));
      return;
    }
    if (cur !== view) return;
    const row = (table2, d, r, fields, title) => {
      const o = {};
      d.headers.forEach((h, i) => {
        o[h] = r.v[i];
      });
      const card = el("div", "easy-row");
      if (title) card.append(el("b", "easy-title", title(o)));
      const ins = {};
      fields.forEach(([h, lab]) => {
        const l = el("label", "field");
        l.append(el("span", "", lab));
        let inp;
        if (h === "days") {
          inp = el("input");
          inp.type = "number";
          inp.min = "0";
          inp.step = "1";
          inp.dir = "ltr";
          inp.value = o[h] || "0";
        } else if (h === "active") {
          inp = el("select");
          [["yes", "نعم"], ["no", "لا"]].forEach(([x, t]) => {
            const op = el("option", "", t);
            op.value = x;
            inp.append(op);
          });
          inp.value = /^(yes|true|1|نعم)$/i.test(o[h]) ? "yes" : "no";
        } else {
          inp = el("input");
          inp.value = o[h] || "";
          if (h !== "name" && h !== "value" || /^\d/.test(o[h] || "")) {
            inp.inputMode = "decimal";
            inp.dir = "ltr";
          }
        }
        ins[h] = inp;
        l.append(inp);
        card.append(l);
      });
      const b = el("button", "btn sm", "حفظ");
      b.type = "button";
      b.addEventListener("click", async () => {
        const values = {};
        Object.keys(ins).forEach((h) => {
          values[h] = ins[h].value.trim();
        });
        if ("days" in values && !/^\d+$/.test(values.days)) {
          toast("يجب أن تكون المدة عدداً صحيحاً من الأيام (0 أو أكثر)", "err");
          return;
        }
        b.disabled = true;
        try {
          const x = await call({ op: "save", table: table2, row: r.r, key: r.v[0], values });
          if (!x.ok) {
            toast(ERR[x.error] || "حدثت مشكلة", "err");
            return;
          }
          toast("حُفظ", "ok");
        } finally {
          b.disabled = false;
        }
      });
      card.append(b);
      return card;
    };
    const sec = (title, note) => {
      const s = el("section", "easy-sec");
      s.append(el("h3", "", title));
      if (note) s.append(el("p", "hint", note));
      v.append(s);
      return s;
    };
    if (pl.ok && pl.rows) {
      const s = sec("الباقات", "السعر بالدولار. يُضاف الرصيد المتجدد بعد نفاد رصيد المستخدم وانقضاء عدد الساعات المحدد.");
      pl.rows.forEach((r) => s.append(row("plans", pl, r, EASY_PLAN, (o) => o.id)));
    }
    if (pr.ok && pr.rows) {
      const s = sec("تكلفة العمليات بالكريديت");
      pr.rows.forEach((r) => s.append(row("pricing", pr, r, [["credits", "الكريديت"], ["active", "مفعل"]], (o) => o.label || o.key)));
    }
    if (st.ok && st.rows) {
      const s = sec("الإعدادات العامة والأمان والمتجر", "هنا كل إعدادات الموقع: حدود الإنشاء، محاولات كلمة المرور ومدة الانتظار، مدة حفظ السجلات، وإعدادات الشراء. سعر الكريديت الواحد = سعر أقل عدد ÷ أقل عدد. يمكن للمستخدم شراء أي عدد بدءاً من الحد الأدنى (مثلاً 51).");
      st.rows.filter((r) => r.v[0] !== "credit_step").forEach((r) => s.append(row("settings", st, r, [["value", "القيمة"]], (o) => o.label || o.key)));
    }
  }
  function askPass(title, note, word) {
    return new Promise((res) => {
      const d = $("passDlg");
      $("passTitle").textContent = title;
      $("passNote").textContent = note || "";
      $("passIn").value = "";
      $("confirmIn").value = "";
      window.SirbUI.msg($("passMsg"), "");
      $("confirmWrap").hidden = !word;
      $("confirmLbl").textContent = word ? "للتأكيد اكتب " + word : "";
      let done = false;
      const fin = (v) => {
        if (done) return;
        done = true;
        d.close();
        res(v);
      };
      $("passForm").onsubmit = (e) => {
        e.preventDefault();
        const p = $("passIn").value;
        if (!p) {
          window.SirbUI.msg($("passMsg"), "اكتب كلمة السر", "error");
          return;
        }
        if (word && $("confirmIn").value.trim() !== word) {
          window.SirbUI.msg($("passMsg"), "اكتب " + word + " تماماً للتأكيد", "error");
          return;
        }
        fin(p);
      };
      d.querySelectorAll("[data-pclose]").forEach((b) => {
        b.onclick = () => fin(null);
      });
      d.onclose = () => fin(null);
      d.showModal();
      $("passIn").focus();
    });
  }
  const HNAME = { SHET_URL: "رابط الشيت في الخادم", SECRIT: "المفتاح السري في الخادم", ALLOW: "المواقع المسموحة (ALLOW)", AI: "Cloudflare (تحسين الوصف والترجمة)", sheet_link: "الاتصال بالشيت", schema: "إصدار الجداول", "prop:SECRIT": "SECRIT في الشيت", "prop:OTP1": "OTP1 (إرسال الأكواد)", "prop:OTP_FROM": "OTP_FROM (اسم المرسل)", "prop:pro-api": "مفتاح pro-api (صور Pro من fal)", "prop:vid-api": "مفتاح vid-api (الفيديو من fal)", free_keys: "مفاتيح الصور المجانية (Google AI Studio)", free: "مفاتيح الصور المجانية", panel: "بيانات دخول اللوحة (ss)", mail_quota: "رصيد رسائل البريد الإلكتروني اليوم", "data:plans": "الباقات Free و Pro موجودة", "data:renew": "إعدادات تجديد الرصيد في الباقات", "data:pricing": "أسعار العمليات (الرصيد لكل عملية)", "trigger:autoCleanLedger": "المسح التلقائي لسجل الكريديت (كل دقيقة)", site_url: "رابط الموقع", srv: "السيرفر", text: "موديل تحسين الوصف", translate: "موديل الترجمة", refine: "تجربة تحسين وصف حقيقي (عربي ← إنجليزي)", peer_ai: "الاتصال بالسيرفر التاني للذكاء الاصطناعي", pro: "FLUX.2 (Pro)", vid: "Wan (الفيديو)" };
  function hRow(c) {
    const r = el("div", "h-row");
    const name = HNAME[c.k] || (c.k.indexOf("free:") === 0 ? "مفتاح " + c.k.slice(5) + " (صور مجانية)" : "") || (c.k.indexOf("prop:free_api") === 0 ? "مفتاح " + c.k.slice(5) + " في الشيت" : "") || (c.k.indexOf("sheet:") === 0 ? "ورقة " + c.k.slice(6) : c.k.indexOf("file:") === 0 ? "ملف " + c.k.slice(5) : c.k);
    const left = el("div", "h-name");
    left.append(el("strong", "", name));
    if (c.model) left.append(el("small", "en", c.model));
    const info = el("span", "h-note en", [c.note, c.ms != null ? c.ms + "ms" : ""].filter(Boolean).join(" · "));
    r.append(el("span", "chip " + (c.ok ? "ok" : "err"), c.ok ? "يعمل" : "توجد مشكلة"), left, info);
    return r;
  }
  function healthView(v) {
    v.append(el("h2", "", "فحص الخادم والموديلات"), el("p", "section-note", "يتحقق الفحص العادي من إعدادات الخادم والشيت والجداول. اختر الموديلات التي تريد تجربتها فعلياً، وانتبه إلى أن تجربة موديل الصور تستهلك من حصة Cloudflare اليومية."));
    const opts = el("div", "h-opts");
    const box = (k, label, on) => {
      const l = el("label", "h-opt");
      const c = el("input");
      c.type = "checkbox";
      c.value = k;
      c.checked = on;
      l.append(c, el("span", "", label));
      opts.append(l);
      return c;
    };
    const boxes = [box("text", "موديل تحسين الوصف", true), box("translate", "موديل الترجمة", true), box("free", "مفاتيح free_api (الصور المجانية - Gemini)", true), box("pro", "مفتاح pro-api (صور Pro)", true), box("vid", "مفتاح vid-api (الفيديو)", true), box("site", "صفحات الموقع وصوره", true), box("servers", "كل السيرفرات (الأساسي والاحتياطي)", true)];
    const btn = el("button", "btn", "");
    btn.type = "button";
    btn.append(svg("pulse"), document.createTextNode("ابدأ الفحص"));
    const out = el("div", "h-out");
    v.append(opts, btn, out);
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      out.textContent = "";
      for (let i = 0; i < 5; i++) out.append(el("span", "sk-line"));
      const t = Date.now();
      try {
        const d = await call({ op: "health", deep: boxes.filter((b) => b.checked).map((b) => b.value) });
        out.textContent = "";
        if (!d.ok) {
          out.append(el("p", "hint", ERR[d.error] || "حدثت مشكلة"));
          return;
        }
        d.servers = [];
        if (boxes[6].checked) {
          const urls = window.SIRB_CONFIG && window.SIRB_CONFIG.WORKER_URLS || [];
          d.servers = await Promise.all(urls.map(async (u, i) => {
            const s0 = Date.now();
            try {
              const r = await fetch(u.replace(/\/$/, "") + "/plans", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: "{}" });
              const j = await r.json().catch(() => null);
              return { k: "srv", model: u.replace("https://", ""), ok: !!j && r.status < 500, ms: Date.now() - s0, note: i ? "احتياطي" : "أساسي" };
            } catch (_) {
              return { k: "srv", model: u.replace("https://", ""), ok: false, ms: Date.now() - s0, note: "لا يستجيب أو رابط اللوحة غير موجود في ALLOW" };
            }
          }));
        }
        const all = [].concat(d.worker || [], d.sheet || [], d.models || [], d.site || [], d.servers);
        const bad = all.filter((c) => !c.ok).length;
        out.append(el("p", "msg " + (bad ? "warn" : "success"), bad ? bad + " أمر يحتاج إلى ضبط · استغرق الفحص " + (Date.now() - t) + "ms" : "كل شيء يعمل · استغرق الفحص " + (Date.now() - t) + "ms"));
        [["الخادم", d.worker], ["الشيت", d.sheet], ["الموديلات", d.models], ["السيرفرات", d.servers], ["الموقع", d.site]].forEach(([n, list]) => {
          if (!list || !list.length) return;
          const g = el("section", "h-group");
          g.append(el("h3", "", n));
          list.forEach((c) => g.append(hRow(c)));
          out.append(g);
        });
      } catch (_) {
        out.textContent = "";
        out.append(el("p", "hint", "لم يستجب الخادم"));
      } finally {
        btn.disabled = false;
      }
    });
  }
  function secretsView(v) {
    v.append(el("h2", "", "الإعدادات السرية"), el("p", "section-note", "هذه Script Properties الموجودة في الشيت (مثل SECRIT و OTP1 و free_api و free_api2 و pro-api و vid-api). القيم السرية لا تُعرض ولا تُرسل للمتصفح نهائياً؛ يظهر فقط هل هي مضبوطة وطولها. لتغيير قيمة اضغط عليها واكتب القيمة الجديدة. إذا غيّرت SECRIT فيجب تعيين القيمة نفسها في الخادمين وإلا فسيتوقف الموقع."));
    const wrap = el("div", "tbl-wrap");
    const bar = el("div", "toolbar");
    const openB = el("button", "btn sm", "");
    openB.type = "button";
    openB.append(svg("eye"), document.createTextNode("اعرض الإعدادات"));
    const addB = el("button", "btn sm ghost", "");
    addB.type = "button";
    addB.append(svg("plus"), document.createTextNode("إضافة"));
    addB.hidden = true;
    const pwB = el("button", "btn sm ghost", "");
    pwB.type = "button";
    pwB.append(document.createTextNode("تغيير كلمة سر اللوحة"));
    bar.append(openB, addB, pwB);
    v.append(bar, wrap);
    let pass = null;
    const view = cur;
    async function run(body) {
      if (!pass) {
        pass = await askPass("الإعدادات السرية", "اكتب كلمة سر اللوحة الحالية.");
        if (!pass) return null;
      }
      const d = await call(Object.assign({ pass }, body));
      if (!d.ok) {
        if (d.error === "pass_wrong") pass = null;
        toast(ERR[d.error] || "حدثت مشكلة", "err");
        return null;
      }
      return d;
    }
    function render(list) {
      wrap.textContent = "";
      addB.hidden = false;
      openB.hidden = true;
      const tb = el("table", "tbl");
      const hr = el("tr");
      ["المفتاح", "القيمة", ""].forEach((x) => hr.append(el("th", "", x)));
      const th = el("thead");
      th.append(hr);
      tb.append(th);
      const body = el("tbody");
      list.forEach((p) => {
        const tr = el("tr");
        const val = el("td", "en mono", p.hidden ? p.set ? "مخفي · " + p.len + " حرف" : "فارغ" : String(p.v == null ? "" : p.v));
        const acts = el("td", "acts");
        if (!p.hidden) {
          const cp = el("button", "btn sm ghost", "");
          cp.type = "button";
          cp.title = "نسخ";
          cp.append(svg("copy"));
          cp.onclick = async (e) => {
            e.stopPropagation();
            try {
              await navigator.clipboard.writeText(String(p.v || ""));
              toast("نُسخ", "ok");
            } catch (_) {
              toast("تعذر النسخ", "err");
            }
          };
          acts.append(cp);
        }
        tr.append(el("td", "en", p.k), val, acts);
        if (p.k !== "ADMIN_HASH" && p.k !== "ADMIN_USER") tr.addEventListener("click", () => editProp(p));
        body.append(tr);
      });
      tb.append(body);
      wrap.append(tb);
    }
    async function editProp(p) {
      const k = p ? p.k : (window.prompt("اسم المفتاح الجديد (حروف إنجليزية وأرقام و _)", "") || "").trim();
      if (!k) return;
      const nv = window.prompt("القيمة الجديدة لـ " + k + (p ? "\n(القيمة الحالية لا تُعرض. اكتب DELETE لحذفه)" : ""), p && !p.hidden ? String(p.v || "") : "");
      if (nv == null || nv === "") return;
      const d = nv === "DELETE" && p ? await run({ op: "propDel", pk: k }) : await run({ op: "propSet", pk: k, pv: nv });
      if (d && cur === view) {
        toast(nv === "DELETE" ? "حُذف" : "حُفظ", "ok");
        render(d.props || []);
      }
    }
    openB.addEventListener("click", async () => {
      const d = await run({ op: "props" });
      if (d && cur === view) render(d.props || []);
    });
    addB.addEventListener("click", () => editProp(null));
    pwB.addEventListener("click", async () => {
      const nu = window.prompt("اسم مستخدم اللوحة الجديد (اتركه فارغاً للإبقاء على الحالي)", "");
      if (nu == null) return;
      const np = window.prompt("كلمة سر اللوحة الجديدة (12 حرفاً على الأقل، فيها حروف وأرقام)", "");
      if (!np) return;
      if (window.prompt("اكتبها مرة تانية للتأكيد", "") !== np) {
        toast("الكلمتان غير متطابقتين", "err");
        return;
      }
      pass = null;
      const d = await run({ op: "adminPass", newPass: np, newUser: nu.trim() });
      if (d) {
        pass = null;
        toast("تم تغيير كلمة سر اللوحة", "ok");
      }
    });
  }
  const FNS = [
    ["CLEAN_NOW", "CLEAN_NOW", "تنظيف فوري: يحذف المؤقت فقط (حركات الكريديت المكتملة، مهام الفيديو القديمة، سجل الأمان الأقدم من log_keep_days). لا يمس المستخدمين أو الطلبات أو الأسعار. نفس التنظيف بيحصل تلقائياً كل دقيقة.", ""],
    ["setup", "setup", "ينشئ الجداول الناقصة ويضبط العناوين ويضيف الإعدادات الافتراضية. آمن ولا يحذف البيانات.", ""],
    ["reset", "reset", "يحذف المستخدمين والطلبات والفواتير وسجل الكريديت والأمان واستخدامات الأكواد. لا يؤثر في الباقات والأسعار والإعدادات والأكواد والأقسام.", "RESET"],
    ["REMOVE_HES", "REMOVE_HES", "يحذف السجلات فقط: سجل الأمان بالكامل، وحركات سجل الكريديت المكتملة. لا يؤثر في المستخدمين والطلبات والأسعار.", "REMOVE"],
    ["dell", "dell", "يحذف جميع أوراق الشيت نهائياً. كلمة سر اللوحة المشفرة تبقى في Script Properties. يجب بعدها تشغيل setup من الشيت نفسه.", "DELL"]
  ];
  function toolsView(v) {
    v.append(el("h2", "", "المنطقة الخطر"), el("p", "section-note", "قبل تشغيل أي دالة يجب إدخال كلمة سر اللوحة مرة أخرى. تتطلب الدوال التي تحذف البيانات إدخال كلمة تأكيد أيضاً."));
    const grid = el("div", "fn-grid");
    const out = el("pre", "fn-log en");
    out.hidden = true;
    const lk = el("div", "fn-card danger");
    const lkState = el("p", "", "جاري قراءة الحالة...");
    const lkB = el("button", "btn ghost danger", "تفعيل الإغلاق الفوري");
    lkB.type = "button";
    lkB.disabled = true;
    lk.append(el("h3", "", "وضع الإغلاق الفوري"), el("p", "", "استخدمه وقت أي هجوم أو مشكلة: خلال ثوانٍ يرى كل الزوار (حتى غير المسجلين) صفحة «جاري التحديث» فقط، ويرفض الخادم كل الطلبات ما عدا لوحة التحكم. عند الإيقاف يعود الموقع طبيعياً."), lkState, lkB);
    let lkOn = false;
    const lkShow = (on) => {
      lkOn = on;
      lkState.textContent = on ? "الحالة: الموقع مغلق الآن" : "الحالة: الموقع يعمل طبيعياً";
      lkB.textContent = on ? "إيقاف الإغلاق وفتح الموقع" : "تفعيل الإغلاق الفوري";
      lkB.className = on ? "btn" : "btn ghost danger";
      lkB.disabled = false;
    };
    call({ op: "lockdown" }).then((d) => {
      if (d && d.ok) lkShow(d.lock === true);
      else lkState.textContent = "تعذّر قراءة الحالة";
    }).catch(() => {
      lkState.textContent = "تعذّر قراءة الحالة";
    });
    lkB.addEventListener("click", async () => {
      const next = !lkOn;
      if (next && !window.confirm("هل تريد إغلاق الموقع لكل الزوار الآن؟")) return;
      lkB.disabled = true;
      try {
        const d = await call({ op: "lockdown", on: next });
        if (!d.ok) {
          toast(ERR[d.error] || "حدثت مشكلة", "err");
          lkB.disabled = false;
          return;
        }
        lkShow(d.lock === true);
        toast(d.lock ? "تم إغلاق الموقع" : "تم فتح الموقع", "ok");
      } catch (_) {
        toast("لم يستجب الخادم", "err");
        lkB.disabled = false;
      }
    });
    grid.append(lk);
    FNS.forEach(([fn, name, desc, word]) => {
      const c = el("div", "fn-card" + (word ? " danger" : ""));
      c.append(el("h3", "en", name + "()"), el("p", "", desc));
      const b = el("button", word ? "btn ghost danger" : "btn", "");
      b.type = "button";
      b.append(svg("play"), document.createTextNode("تشغيل " + name));
      b.addEventListener("click", async () => {
        const pass = await askPass("تشغيل " + name, desc, word);
        if (!pass) return;
        b.disabled = true;
        out.hidden = false;
        out.textContent = "جاري تشغيل " + name + "...";
        try {
          const d = await call({ op: "run", fn, pass });
          if (!d.ok) {
            out.textContent = (ERR[d.error] || d.error || "حدثت مشكلة") + (d.data && d.data.reason ? "\n" + d.data.reason : "");
            toast(ERR[d.error] || "حدثت مشكلة", "err");
            return;
          }
          out.textContent = name + " اكتملت في " + d.ms + "ms\n\n" + (d.log || "(لا توجد رسائل)");
          toast(name + " عملت بنجاح", "ok");
          if (fn === "dell") {
            setTimeout(() => showLogin("حُذف الشيت. شغّل setup من الشيت واكتب بيانات الدخول في ورقة ss."), 1500);
          }
        } catch (_) {
          out.textContent = "لم يستجب الخادم. قد تكون الدالة لا تزال قيد التشغيل، انتظر دقيقة ثم أجرِ فحصاً.";
        } finally {
          b.disabled = false;
        }
      });
      c.append(b);
      grid.append(c);
    });
    v.append(grid, out);
  }
  let started = false;
  function showLogin(m) {
    $("gate").hidden = true;
    $("shell").hidden = true;
    $("login").hidden = false;
    $("loginMsg").textContent = "";
    if (m) window.SirbUI.msg($("loginMsg"), m, "warn");
    $("admUser").focus();
  }
  function open_(user) {
    $("who").textContent = user || "";
    $("login").hidden = true;
    $("gate").hidden = true;
    $("shell").hidden = false;
    if (!started) {
      started = true;
      window.addEventListener("hashchange", show);
    }
    show();
  }
  const LERR = { wrong: "اسم المستخدم أو كلمة السر غير صحيحة", locked: "محاولات خاطئة كثيرة، انتظر 15 دقيقة", not_set: "بيانات الدخول غير مسجلة: اكتب اسم المستخدم في الخانة A1 وكلمة السر في B1 بورقة ss في الشيت", invalid: "اكتب اسم المستخدم وكلمة السر" };
  document.addEventListener("DOMContentLoaded", async () => {
    api = window.SirbApi.api;
    $("editDlg").querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => $("editDlg").close()));
    $("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const user = $("admUser").value.trim(), pass = $("admPass").value;
      if (!user || !pass) {
        window.SirbUI.msg($("loginMsg"), LERR.invalid, "error");
        return;
      }
      const b = $("loginBtn");
      b.disabled = true;
      try {
        const r = await api("/admin-login", { user, pass });
        if (r.status === 200 && r.data && r.data.ok) {
          $("admPass").value = "";
          toast("أهلاً بك في لوحة التحكم", "ok");
          open_(r.data.user);
        } else window.SirbUI.msg($("loginMsg"), LERR[r.data && r.data.error] || "حدثت مشكلة، حاول مرة أخرى", "error");
      } catch (_) {
        window.SirbUI.msg($("loginMsg"), "لا يوجد اتصال، حاول مرة أخرى", "error");
      } finally {
        b.disabled = false;
      }
    });
    $("admOut").addEventListener("click", async () => {
      try {
        await api("/admin-logout", {});
      } catch (_) {
      }
      $("admUser").value = "";
      showLogin();
    });
    try {
      const r = await api("/admin", { op: "whoami" });
      if (r.status === 200 && r.data && r.data.ok) open_(r.data.user);
      else showLogin();
    } catch (_) {
      showLogin("لا يوجد اتصال، حاول مرة أخرى");
    }
  });
})();
