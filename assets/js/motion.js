/* Undangan Cirebon–Cilacap — semua motion (GSAP + ScrollTrigger).
 * Bila GSAP gagal dimuat, file ini diam saja dan konten tetap tampil (AC8). */
(function () {
  "use strict";
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (!gsap || !ST) { window.Motion = { ready: false }; return; }
  gsap.registerPlugin(ST);

  var $$ = function (s, r) { return gsap.utils.toArray(s, r); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var html = document.documentElement;
  html.classList.add("has-motion");

  /* ---------- Cover: gerbang muncul ---------- */
  var idle = [];
  var skyItems = $$("[data-cover-item]"), doorItems = $$("[data-door-item]");
  var coverItems = skyItems.concat(doorItems);
  var corners = { tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] };
  var gateEl = document.getElementById("gate");
  var crownLines = $$(".gate__crown-relief .relief--draw");

  if (!reduce) {
    gsap.from(gateEl, { y: 90, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.1 });
    gsap.from(skyItems, { y: 24, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.14, delay: 0.5 });
    gsap.from(doorItems, { y: 14, opacity: 0, duration: 0.9, ease: "power2.out", stagger: 0.12, delay: 1.3 });
    crownLines.forEach(function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 300;
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 0.9 });
    });
    bloom(document.querySelector(".gate__flower"), 1.1, "200 118", true);
    var glow = document.querySelector(".gate__glow");
    if (glow) idle.push(gsap.to(glow, { opacity: 0.55, scale: 0.85, svgOrigin: "200 296", duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    Object.keys(corners).forEach(function (k, i) {
      var c = document.querySelector(".cover__cloud--" + k);
      if (!c) return;
      gsap.from(c, { xPercent: corners[k][0] * 40, opacity: 0, duration: 1.8, ease: "power2.out", delay: 0.05 * i });
      idle.push(gsap.to(c, { x: corners[k][0] * -14, y: 6, duration: 4.5 + i, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 }));
    });
  } else {
    gsap.from(coverItems, { opacity: 0, duration: 0.6, stagger: 0.05 });
  }

  /* ---------- Waves loop (dijeda di luar layar) ---------- */
  $$(".waves").forEach(function (w) {
    var back = w.querySelector(".wave--back"), front = w.querySelector(".wave--front");
    if (!back || reduce) return;
    // Pola berulang tiap 150/200 unit → geser 1200 lalu ulang = loop mulus.
    var tl = {
      t: [gsap.to(back, { x: -1200, duration: 26, ease: "none", repeat: -1, paused: true }),
          gsap.to(front, { x: -1200, duration: 16, ease: "none", repeat: -1, paused: true })],
      play: function () { this.t.forEach(function (t) { t.play(); }); },
      pause: function () { this.t.forEach(function (t) { t.pause(); }); },
      kill: function () { this.t.forEach(function (t) { t.kill(); }); },
    };
    if (w.closest(".cover")) { tl.play(); w._tl = tl; return; }
    ST.create({ trigger: w, start: "top bottom", end: "bottom top", onToggle: function (s) { s.isActive ? tl.play() : tl.pause(); } });
  });

  /* ---------- Wijayakusuma mekar ---------- */
  function bloom(host, delay, origin, noSpin) {
    if (!host) return null;
    origin = origin || "50 50";
    var outer = host.querySelectorAll(".wk-petal--outer"), inner = host.querySelectorAll(".wk-shade, .wk-petal--inner");
    var rest = host.querySelectorAll(".wk-core, .wk-stamen");
    var leaves = host.querySelectorAll(".wk-leaf"), head = host.querySelector(".wk-head");
    var tl = gsap.timeline({ delay: delay || 0 });
    if (reduce) { tl.from(host, { opacity: 0, duration: 0.6 }); return tl; }
    // daun tumbuh dulu dari pangkalnya, lalu bunga mekar lapis demi lapis (seperti mekar di malam hari)
    if (leaves.length) tl.from(leaves, { scale: 0.2, opacity: 0, svgOrigin: function (i, el) { return el.getAttribute("data-o"); }, duration: 1.1, ease: "power3.out", stagger: 0.12 }, 0);
    tl.from(outer, { scale: 0, opacity: 0, svgOrigin: origin, duration: 1.4, ease: "back.out(1.4)", stagger: { amount: 0.8 } }, leaves.length ? 0.35 : 0)
      .from(inner, { scale: 0, opacity: 0, svgOrigin: origin, duration: 1.1, ease: "back.out(1.8)", stagger: { amount: 0.5 } }, "-=1.2")
      .from(rest, { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: { amount: 0.4 } }, "-=0.6");
    if (!noSpin && head && leaves.length) {
      // bunga berputar sangat pelan, daun bergoyang lembut
      tl.to(head, { rotate: 360, svgOrigin: origin, duration: 120, ease: "none", repeat: -1 }, 0);
      tl.to(leaves, { rotate: function (i) { return i % 2 ? 3 : -3; }, svgOrigin: function (i, el) { return el.getAttribute("data-o"); }, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 }, 1.6);
    } else if (!noSpin) tl.to(host, { rotate: 360, duration: 90, ease: "none", repeat: -1 }, 0);
    return tl;
  }

  /* ---------- Bingkai Wadasan tergambar ---------- */
  function prepDraw(root) {
    root.querySelectorAll(".wd-line").forEach(function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 600;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: reduce ? 0 : len });
    });
    if (!reduce) gsap.set(root.querySelectorAll(".wd-fill"), { opacity: 0 });
  }
  function draw(root, delay) {
    if (reduce) return;
    gsap.to(root.querySelectorAll(".wd-fill"), { opacity: 1, duration: 0.8, ease: "power1.out", delay: delay || 0 });
    gsap.to(root.querySelectorAll(".wd-line"), { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.18, delay: delay || 0 });
  }

  /* ---------- Buka undangan ---------- */
  function open() {
    return new Promise(function (resolve) {
      idle.forEach(function (t) { t.kill(); });
      $$(".event, .ayat").forEach(prepDraw);
      var inView = $$(".salam [data-reveal]").filter(function (n) { return n.getBoundingClientRect().top < window.innerHeight; });
      var tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: function () {
          var cw = document.querySelector(".cover__waves");
          if (cw && cw._tl) cw._tl.kill();
          initScroll();
          resolve();
        },
      });
      if (reduce) {
        tl.to("#cover", { opacity: 0, duration: 0.5 });
        return;
      }
      // Masuk melewati pintu gerbang: kamera mendekat, cahaya dari dalam memenuhi layar.
      tl.to(coverItems, { y: -16, opacity: 0, duration: 0.5, stagger: 0.03, ease: "power2.in" }, 0)
        .to(".gate__glow", { scale: 2.6, opacity: 1, svgOrigin: "200 296", duration: 0.8, ease: "power2.out" }, 0.1)
        .to(".cover__cloud--tl, .cover__cloud--bl", { xPercent: -120, scale: 1.4, opacity: 0, duration: 1.6 }, 0.15)
        .to(".cover__cloud--tr, .cover__cloud--br", { xPercent: 120, scale: 1.4, opacity: 0, duration: 1.6 }, 0.15)
        .to(".cover__waves", { yPercent: 100, duration: 0.9 }, 0.25)
        .to(gateEl, { scale: 3.8, duration: 1.75, ease: "power2.in" }, 0.35)
        .to(".gate__light", { opacity: 1, duration: 1.0, ease: "power1.in" }, 0.75)
        .to("#cover", { "--cover-alpha": 0, duration: 0.6, ease: "power1.inOut" }, 1.4)
        .to(gateEl, { opacity: 0, duration: 0.45, ease: "power1.out" }, 1.95)
        .add(function () { bloom(document.querySelector(".salam__flower")); }, 1.9)
        .add(function () { var a = document.querySelector(".ayat"); if (a && a.getBoundingClientRect().top < window.innerHeight) draw(a, 0); }, 2.2)
        .from(inView, { y: 30, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", clearProps: "transform,opacity" }, 2.0)
        .set("#cover", { opacity: 0 }, 2.45);
    });
  }

  /* ---------- Scroll ---------- */
  var scrollReady = false;
  function initScroll() {
    if (scrollReady) return;
    scrollReady = true;
    ST.refresh();

    // Elemen salam sudah tampil di timeline pembuka; sisanya di-reveal saat scroll.
    var targets = $$("[data-reveal]").filter(function (n) {
      return !n.closest(".salam") || n.getBoundingClientRect().top > window.innerHeight;
    });
    // Gerak minimal: konten langsung tampil, tanpa menunggu animasi (AC8).
    if (!reduce) {
      gsap.set(targets, { opacity: 0, y: 34 });
      ST.batch(targets, {
        start: "top 90%",
        once: true,
        batchMax: 6,
        onEnter: function (batch) {
          // stagger dibatasi agar scroll cepat tidak membuat konten terlambat muncul
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: { amount: Math.min(0.45, 0.12 * (batch.length - 1)) }, overwrite: "auto" });
          batch.forEach(function (n) { if (n.querySelector(".wd-line")) draw(n, 0.2); });
        },
      });
    }

    // Kartu acara / ayat: bingkai wadasan

    // Bunga penutup mekar saat terlihat
    var pf = document.querySelector(".penutup__flower");
    if (pf) {
      gsap.set(pf.querySelectorAll(".wk-petal, .wk-shade, .wk-core, .wk-stamen, .wk-leaf"), { opacity: 0 });
      ST.create({
        trigger: pf, start: "top 85%", once: true,
        onEnter: function () { gsap.set(pf.querySelectorAll(".wk-petal, .wk-shade, .wk-core, .wk-stamen, .wk-leaf"), { opacity: 1 }); bloom(pf); },
      });
    }

    if (reduce) return;

    // Parallax awan Mega Mendung
    $$("[data-parallax]").forEach(function (c) {
      var amt = parseFloat(c.getAttribute("data-parallax")) || -20;
      gsap.fromTo(c, { yPercent: -amt }, {
        yPercent: amt, ease: "none",
        scrollTrigger: { trigger: c.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    });

    // Awan samping desktop bergerak pelan mengikuti scroll halaman
    gsap.to(".stage__cloud--l", { yPercent: 30, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 1 } });
    gsap.to(".stage__cloud--r", { yPercent: -30, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 1 } });

    // Judul script "tertulis" dari kiri ke kanan mengikuti scroll
    $$(".sec__title").forEach(function (t) {
      gsap.fromTo(t, { clipPath: "inset(-20% 100% -20% 0)" }, {
        clipPath: "inset(-20% 0% -20% 0)", ease: "none",
        scrollTrigger: { trigger: t, start: "top 92%", end: "top 60%", scrub: 0.5 },
      });
    });
  }

  // Jika halaman dimuat ulang tanpa cover (mis. sudah dibuka), siapkan scroll.
  window.addEventListener("load", function () { ST.refresh(); });

  window.Motion = { ready: true, open: open };
})();
