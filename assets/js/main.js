/* Undangan Cirebon–Cilacap — render data, nama tamu, musik, galeri, amplop. */
(function () {
  "use strict";

  var D = window.WEDDING || {};
  var doc = document;
  var $ = function (sel, root) { return (root || doc).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
  var NS = "http://www.w3.org/2000/svg";
  var TZ = D.zonaWaktu || { label: "WIB", offset: "+07:00", iana: "Asia/Jakarta" };

  // Mulai selalu dari atas (cover).
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* ---------- util ---------- */
  function get(path) {
    var parts = path.split(".");
    var root = D.mempelai && parts[0] in D.mempelai ? D.mempelai : D;
    return parts.reduce(function (o, k) { return o == null ? o : o[k]; }, root);
  }
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text; // selalu teks, tidak pernah HTML
    return n;
  }
  function toDate(local) { return new Date(local + ":00" + TZ.offset); }
  function fmt(date, opts) {
    try { return new Intl.DateTimeFormat("id-ID", Object.assign({ timeZone: TZ.iana }, opts)).format(date); }
    catch (e) { return date.toLocaleString("id-ID", opts); }
  }
  function fmtDay(local) { return fmt(toDate(local), { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
  function fmtTime(local) { return fmt(toDate(local), { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", "."); }
  function utcStamp(date) { return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }

  /* ---------- ornamen ---------- */
  // Wijayakusuma (Cilacap): digambar di ornaments.js; data-leaves menambah daun pipih.
  function flower(host, opts) {
    opts = opts || {};
    opts.leaves = host.hasAttribute("data-leaves");
    host.innerHTML = window.Orn.flowerSVG(opts); // string SVG statis, bukan input pengguna
  }

  // Ombak Teluk Penyu (Cilacap): dua lapis, panjang 2× agar bisa di-loop.
  function waves(host) {
    function crest(y, amp, step, curl) {
      var d = "M0 " + y;
      for (var x = 0; x < 2400; x += step) {
        d += " Q" + (x + step / 4) + " " + (y - amp) + " " + (x + step / 2) + " " + y + " T" + (x + step) + " " + y;
      }
      d += " V120 H0Z";
      var c = "";
      if (curl) {
        for (var cx = step / 4; cx < 2400; cx += step) {
          c += '<path class="wave-curl" d="M' + (cx - 10) + " " + (y - amp * 0.55) + " q10 -12 20 -2 q-6 -2 -9 4\"/>";
        }
      }
      return '<path d="' + d + '"/>' + c;
    }
    host.setAttribute("aria-hidden", "true");
    host.innerHTML =
      '<svg viewBox="0 0 1200 120" preserveAspectRatio="none">' +
      '<g class="wave wave--back">' + crest(58, 22, 200, false) + "</g>" +
      '<g class="wave wave--front">' + crest(78, 18, 150, true) + "</g>" +
      "</svg>";
  }

  // Wadasan (Cirebon): bingkai batu bertingkat.
  function wadasan(host) {
    var base = "M0 70 V54 C8 54 10 46 20 46 H34 C40 46 42 36 52 36 H66 C72 36 74 24 86 24 H104 C112 24 114 12 126 12 H174 C186 12 188 24 196 24 H214 C226 24 228 36 234 36 H248 C258 36 260 46 266 46 H280 C290 46 292 54 300 54 V70";
    host.setAttribute("aria-hidden", "true");
    host.innerHTML =
      '<svg viewBox="0 0 300 72" preserveAspectRatio="xMidYMax meet">' +
      '<path class="wd-line" d="' + base + '"/>' +
      '<path class="wd-line wd-line--2" transform="translate(22 10) scale(.853 .86)" d="' + base + '"/>' +
      '<path class="wd-line wd-line--3" transform="translate(44 20) scale(.707 .72)" d="' + base + '"/>' +
      "</svg>";
  }

  var Orn = window.Orn || {};
  if (Orn.crownFrame) wadasan = Orn.crownFrame; // bingkai relief mahkota gerbang

  $$("[data-orn]").forEach(function (h) {
    var t = h.getAttribute("data-orn");
    if (t === "gate") { if (Orn.gate) Orn.gate(h); return; }
    if (t === "flower") flower(h);
    else if (t === "flower-mini") flower(h, { mini: true });
    else if (t === "waves") waves(h);
    else if (t === "wadasan") wadasan(h);
  });

  /* ---------- teks dari data ---------- */
  $$("[data-bind]").forEach(function (n) {
    var v = get(n.getAttribute("data-bind"));
    if (v != null) n.textContent = v;
  });

  /* ---------- urutan nama: laki-laki dulu (default) atau perempuan dulu ---------- */
  // Diatur lewat data.js (urutanNama) atau link: ?urutan=wanita / ?urutan=pria
  var urutan = D.urutanNama === "wanita" ? "wanita" : "pria";
  try {
    var qUrut = (new URLSearchParams(location.search).get("urutan") || "").toLowerCase();
    if (qUrut === "wanita" || qUrut === "perempuan" || qUrut === "w") urutan = "wanita";
    else if (qUrut === "pria" || qUrut === "laki" || qUrut === "laki-laki" || qUrut === "p") urutan = "pria";
  } catch (e) { /* abaikan */ }
  if (urutan === "wanita") {
    // Tukar posisi setiap pasangan [data-urut="pria"] dan [data-urut="wanita"] yang sesaudara.
    $$('[data-urut="pria"]').forEach(function (p) {
      var w = $(':scope > [data-urut="wanita"]', p.parentNode);
      if (!w) return;
      var mark = doc.createComment("");
      p.parentNode.replaceChild(mark, w);
      p.parentNode.replaceChild(w, p);
      mark.parentNode.replaceChild(p, mark);
    });
  }
  var namaPasangan = D.mempelai
    ? (urutan === "wanita"
        ? D.mempelai.wanita.panggilan + " & " + D.mempelai.pria.panggilan
        : D.mempelai.pria.panggilan + " & " + D.mempelai.wanita.panggilan)
    : "";
  if (D.mempelai) doc.title = "Undangan Pernikahan " + namaPasangan;
  if (D.tanggalUtama) $("#cover-date").textContent = fmtDay(D.tanggalUtama);

  /* ---------- AC1: nama tamu ---------- */
  var guest = "";
  try { guest = new URLSearchParams(location.search).get("to") || ""; } catch (e) { guest = ""; }
  guest = guest.replace(/\s+/g, " ").trim().slice(0, 60);
  if (guest) $("#guest-name").textContent = guest;

  /* ---------- AC5: acara ---------- */
  var eventsHost = $("#events");
  (D.acara || []).forEach(function (a) {
    var card = el("article", "event");
    card.setAttribute("data-reveal", "");
    var frameTop = el("div", "event__frame");
    wadasan(frameTop);
    card.appendChild(frameTop);

    card.appendChild(el("h3", "event__name script", a.nama));
    card.appendChild(el("p", "event__day", fmtDay(a.mulai)));
    var time = a.selesai ? fmtTime(a.mulai) + " – " + fmtTime(a.selesai) + " " + TZ.label : fmtTime(a.mulai) + " " + TZ.label + " – selesai";
    card.appendChild(el("p", "event__time", time));
    card.appendChild(el("span", "event__rule"));
    card.appendChild(el("p", "event__place", a.tempat));
    card.appendChild(el("p", "event__addr", a.alamat));

    var actions = el("div", "event__actions");
    if (a.maps) {
      var m = el("a", "btn btn--gold btn--sm", "Lihat Peta");
      m.href = a.maps; m.target = "_blank"; m.rel = "noopener";
      actions.appendChild(m);
    }
    var start = toDate(a.mulai);
    var end = a.selesai ? toDate(a.selesai) : new Date(start.getTime() + 2 * 3600 * 1000);
    var names = namaPasangan;
    var cal = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(a.nama + " " + names) +
      "&dates=" + utcStamp(start) + "/" + utcStamp(end) +
      "&location=" + encodeURIComponent(a.tempat + ", " + a.alamat) +
      "&details=" + encodeURIComponent("Undangan pernikahan " + names);
    var c = el("a", "btn btn--ghost btn--sm", "Simpan ke Kalender");
    c.href = cal; c.target = "_blank"; c.rel = "noopener";
    actions.appendChild(c);
    card.appendChild(actions);
    eventsHost.appendChild(card);
  });

  /* ---------- AC6: galeri + lightbox ---------- */
  var photos = (D.galeri || []).filter(function (p) { return p && p.src; });
  if (!photos.length) $("#galeri").remove();
  else {
    var gal = $("#gallery");
    photos.forEach(function (p, i) {
      var b = el("button", "gallery__item");
      b.type = "button";
      b.setAttribute("data-reveal", "");
      b.setAttribute("aria-label", "Buka " + (p.alt || "foto " + (i + 1)));
      var img = el("img");
      img.src = p.src; img.alt = p.alt || ""; img.loading = "lazy"; img.decoding = "async";
      b.appendChild(img);
      b.addEventListener("click", function () { openLb(i, b); });
      gal.appendChild(b);
    });
  }

  var lb = $("#lightbox"), lbImg = $("#lightbox-img"), lbCount = $("#lightbox-count");
  var lbIndex = 0, lbReturn = null;
  function showLb(i) {
    lbIndex = (i + photos.length) % photos.length;
    lbImg.src = photos[lbIndex].src;
    lbImg.alt = photos[lbIndex].alt || "";
    lbCount.textContent = lbIndex + 1 + " / " + photos.length;
  }
  function openLb(i, from) {
    lbReturn = from;
    showLb(i);
    lb.hidden = false;
    doc.documentElement.classList.add("is-lb");
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    $(".lightbox__close").focus();
  }
  function closeLb() {
    lb.classList.remove("is-open");
    doc.documentElement.classList.remove("is-lb");
    setTimeout(function () { lb.hidden = true; }, 250);
    if (lbReturn) lbReturn.focus();
  }
  lb.addEventListener("click", function (e) {
    var act = e.target.closest("[data-lb]");
    if (act) {
      var k = act.getAttribute("data-lb");
      if (k === "close") closeLb(); else showLb(lbIndex + (k === "next" ? 1 : -1));
    } else if (e.target === lb || e.target.classList.contains("lightbox__figure")) closeLb();
  });
  doc.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowRight") showLb(lbIndex + 1);
    else if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    else if (e.key === "Tab") { // jaga fokus di dalam lightbox
      var f = $$("button", lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (tx == null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40) showLb(lbIndex + (dx < 0 ? 1 : -1));
  });

  /* ---------- AC7: amplop ---------- */
  var toast = $("#toast"), toastT;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toast.classList.remove("is-on"); }, 2000);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (res, rej) {
      var ta = el("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
      doc.body.appendChild(ta);
      ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = doc.execCommand("copy"); } catch (e) { ok = false; }
      doc.body.removeChild(ta);
      ok ? res() : rej();
    });
  }
  var gifts = (D.amplop || []).filter(function (g) { return g && g.nomor; });
  if (!gifts.length && !D.qris) $("#amplop").remove();
  else {
    var gh = $("#gifts");
    gifts.forEach(function (g) {
      var card = el("article", "gift");
      card.setAttribute("data-reveal", "");
      card.appendChild(el("p", "gift__bank", g.bank));
      card.appendChild(el("p", "gift__num", g.nomor));
      card.appendChild(el("p", "gift__name", "a.n. " + g.atasNama));
      var btn = el("button", "btn btn--ink btn--sm gift__copy", "Salin");
      btn.type = "button";
      btn.addEventListener("click", function () {
        var raw = String(g.nomor).replace(/\s+/g, "");
        copyText(raw).then(function () {
          btn.textContent = "Tersalin ✓";
          btn.classList.add("is-done");
          say("Nomor " + g.bank + " tersalin");
          setTimeout(function () { btn.textContent = "Salin"; btn.classList.remove("is-done"); }, 2000);
        }, function () { say("Gagal menyalin. Silakan salin manual: " + raw); });
      });
      card.appendChild(btn);
      gh.appendChild(card);
    });
    if (D.qris) { $("#qris-img").src = D.qris; $("#qris").hidden = false; }
  }

  /* ---------- hitung mundur menuju tanggalUtama ---------- */
  (function () {
    var box = $("#countdown");
    if (!box) return;
    if (!D.tanggalUtama) { box.remove(); return; }
    var target = toDate(D.tanggalUtama).getTime();
    var units = [["hari", 86400], ["jam", 3600], ["menit", 60], ["detik", 1]];
    var nums = units.map(function (u) {
      var s = el("div", "countdown__unit");
      var n = el("strong", null, "0");
      s.appendChild(n);
      s.appendChild(el("span", null, u[0].charAt(0).toUpperCase() + u[0].slice(1)));
      box.appendChild(s);
      return n;
    });
    var timer;
    function tick() {
      var left = Math.max(0, Math.floor((target - Date.now()) / 1000));
      if (!left) {
        clearInterval(timer);
        box.textContent = "";
        box.appendChild(el("p", "countdown__done", "Hari bahagia telah tiba. Terima kasih atas doa restunya."));
        return;
      }
      units.forEach(function (u, i) {
        var v = Math.floor(left / u[1]);
        left -= v * u[1];
        nums[i].textContent = i ? String(v).padStart(2, "0") : String(v);
      });
    }
    box.hidden = false;
    tick();
    timer = setInterval(tick, 1000);
  })();

  /* ---------- Ucapan & doa (SQLite via api/ucapan.php) ---------- */
  (function () {
    var sec = $("#ucapan");
    if (!sec) return;
    if (!D.ucapanApi) { sec.remove(); return; }
    var API = D.ucapanApi;
    var form = $("#wish-form"), list = $("#wishes"), status = $("#wishes-status");
    var errBox = $("#wish-error"), submit = $("#wish-submit"), nameIn = $("#wish-nama"), msgIn = $("#wish-ucapan"), count = $("#wish-count");
    var LABEL = { hadir: "Hadir", tidak: "Tidak hadir", ragu: "Masih ragu" };

    if (guest) nameIn.value = guest;
    msgIn.addEventListener("input", function () { count.textContent = msgIn.value.length + " / 500"; });

    function refreshScroll() { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }
    function when(iso) {
      var d = new Date(iso);
      if (isNaN(d)) return "";
      var s = Math.round((Date.now() - d.getTime()) / 1000);
      if (s < 60) return "baru saja";
      if (s < 3600) return Math.floor(s / 60) + " menit lalu";
      if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
      if (s < 7 * 86400) return Math.floor(s / 86400) + " hari lalu";
      return fmt(d, { day: "numeric", month: "short", year: "numeric" });
    }
    function card(w) {
      var c = el("article", "wish");
      var head = el("div", "wish__head");
      head.appendChild(el("p", "wish__name", w.nama));
      head.appendChild(el("span", "wish__badge wish__badge--" + w.kehadiran, LABEL[w.kehadiran] || ""));
      c.appendChild(head);
      c.appendChild(el("p", "wish__text", w.ucapan)); // textContent: aman dari HTML
      var t = el("time", "wish__time", when(w.dibuat));
      t.dateTime = w.dibuat;
      c.appendChild(t);
      return c;
    }
    function setStatus(text) {
      status.textContent = text;
      status.hidden = !text;
      if (text && status.parentNode !== list) list.appendChild(status);
    }
    function api(opts) {
      return fetch(API, Object.assign({ headers: { "Accept": "application/json" }, cache: "no-store" }, opts)).then(function (r) {
        return r.json().catch(function () { throw new Error("Server ucapan tidak tersedia."); }).then(function (j) {
          if (!r.ok || !j.ok) throw new Error(j.error || "Gagal menghubungi server.");
          return j;
        });
      });
    }
    function load() {
      return api().then(function (d) {
        list.textContent = "";
        d.items.forEach(function (w) { list.appendChild(card(w)); });
        setStatus(d.items.length ? "" : "Belum ada ucapan. Jadilah yang pertama!");
        refreshScroll();
      }, function () {
        setStatus("Ucapan belum dapat dimuat saat ini.");
      });
    }
    load();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var body = { nama: String(fd.get("nama") || "").trim(), kehadiran: fd.get("kehadiran") || "", ucapan: String(fd.get("ucapan") || "").trim(), website: fd.get("website") || "" };
      var err = !body.nama ? "Nama wajib diisi." : !body.kehadiran ? "Pilih konfirmasi kehadiran." : body.ucapan.length < 2 ? "Ucapan wajib diisi." : "";
      if (err) { errBox.textContent = err; errBox.hidden = false; return; }
      errBox.hidden = true;
      submit.disabled = true;
      submit.textContent = "Mengirim…";
      api({ method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body) })
        .then(function (res) {
          if (res.item) {
            setStatus("");
            list.insertBefore(card(res.item), list.firstChild);
            refreshScroll();
          }
          msgIn.value = ""; count.textContent = "0 / 500";
          form.querySelectorAll("input[name=kehadiran]").forEach(function (r) { r.checked = false; });
          say("Terima kasih atas ucapan dan doanya");
        }, function (ex) { errBox.textContent = ex.message; errBox.hidden = false; })
        .then(function () { submit.disabled = false; submit.textContent = "Kirim Ucapan"; });
    });
  })();

  /* ---------- AC3: musik ---------- */
  var audio = $("#music"), mBtn = $("#music-btn"), musicOk = !!D.musik, wasPlaying = false;
  function setPlaying(on) {
    mBtn.classList.toggle("is-playing", on);
    mBtn.setAttribute("aria-pressed", on ? "true" : "false");
    mBtn.setAttribute("aria-label", on ? "Jeda musik" : "Putar musik");
  }
  function killMusic() { musicOk = false; mBtn.hidden = true; try { audio.pause(); } catch (e) {} }
  function play() {
    if (!musicOk) return;
    var p = audio.play();
    if (p && p.catch) p.then(function () { setPlaying(true); }, function (err) {
      if (err && err.name === "NotAllowedError") setPlaying(false); // diblokir autoplay; tombol tetap ada
      else killMusic();
    });
  }
  if (musicOk) {
    audio.addEventListener("error", killMusic);
    audio.addEventListener("pause", function () { setPlaying(false); });
    audio.addEventListener("play", function () { setPlaying(true); });
    mBtn.addEventListener("click", function () { audio.paused ? play() : audio.pause(); });
    doc.addEventListener("visibilitychange", function () {
      if (!musicOk) return;
      if (doc.hidden) { wasPlaying = !audio.paused; audio.pause(); }
      else if (wasPlaying) play();
    });
  }

  /* ---------- AC2: buka undangan ---------- */
  var cover = $("#cover"), app = $("#app");
  function unlock() {
    doc.documentElement.classList.remove("is-locked");
    app.removeAttribute("aria-hidden");
    cover.setAttribute("aria-hidden", "true");
    cover.style.pointerEvents = "none";
  }
  $("#open-btn").addEventListener("click", function () {
    if (musicOk) { audio.src = D.musik; mBtn.hidden = false; play(); }
    var done = function () {
      cover.hidden = true;
      var first = $("#salam");
      if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: true }); }
    };
    unlock();
    if (window.Motion && window.Motion.ready) window.Motion.open().then(done);
    else { cover.classList.add("is-leaving"); setTimeout(done, 700); }
  }, { once: true });

  window.Invite = { ready: true };
})();
