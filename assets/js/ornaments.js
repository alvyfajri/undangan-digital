/* Ornamen SVG — digambar ulang dari referensi budaya:
 *  - Gerbang Keraton Kasepuhan: mahkota awan, atap, sayap, pintu lengkung, kaki Wadasan.
 *  - Wijayakusuma (lukisan Epiphyllum) & ombak Teluk Penyu (Cilacap).
 * Semua dibuat sebagai string/elemen SVG statis (tanpa input pengguna). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function f(n) { return Math.round(n * 10) / 10; }

  /* Spiral (mata Wadasan / ujung Mega Mendung). dir: 1 searah jarum jam, -1 sebaliknya. */
  function spiral(cx, cy, r, turns, dir, a0) {
    turns = turns || 2.2; dir = dir || 1; a0 = a0 || 0;
    var n = Math.ceil(turns * 24), d = "";
    for (var i = 0; i <= n; i++) {
      var t = i / n, rr = r * (0.12 + 0.88 * t), a = a0 + dir * turns * Math.PI * 2 * t;
      d += (i ? " L" : "M") + f(cx + Math.cos(a) * rr) + " " + f(cy + Math.sin(a) * rr);
    }
    return d;
  }

  /* ---------- Wijayakusuma (Epiphyllum) — digambar dari referensi lukisan ----------
   * Lapisan (belakang → depan): daun pipih bergelombang (opsional), kelopak luar panjang
   * tipis bersemu merah muda, kelopak putih lancip, kelopak dalam lebar membentuk mangkuk,
   * benang sari kuning, dan putik merah muda yang melengkung keluar. */
  function petal(cx, cy, len, w, bend, base) {
    // kelopak lancip menghadap ke atas (-y), ujung sedikit ditekuk (bend × len)
    var b = bend * len, y0 = cy - (base || 0);
    return "M" + f(cx - w * 0.25) + " " + f(y0) +
      " C" + f(cx - w) + " " + f(y0 - len * 0.3) + " " + f(cx - w * 0.85 + b * 0.5) + " " + f(cy - len * 0.78) + " " + f(cx + b) + " " + f(cy - len) +
      " C" + f(cx + w * 0.85 + b * 0.5) + " " + f(cy - len * 0.78) + " " + f(cx + w) + " " + f(y0 - len * 0.3) + " " + f(cx + w * 0.25) + " " + f(y0) + "Z";
  }
  function ring(cx, cy, n, a0, cls, mk) {
    var out = "";
    for (var i = 0; i < n; i++) {
      out += '<g transform="rotate(' + f(a0 + (i * 360) / n) + " " + cx + " " + cy + ')"><g class="' + cls + '">' + mk(i) + "</g></g>";
    }
    return out;
  }
  /* Daun Wijayakusuma: pipih, tepi bergelombang (berlekuk), tulang tengah. */
  function leaf(x0, y0, ang, len, w) {
    var L = [], R = [], n = 36;
    for (var i = 0; i <= n; i++) {
      var t = i / n, prof = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.75) * w;
      var notch = 1 - 0.22 * Math.pow(Math.abs(Math.sin(t * Math.PI * 5)), 3);
      var c = Math.sin(t * Math.PI * 1.2) * w * 0.35; // sedikit melengkung
      L.push([t * len, c - prof * notch]); R.push([t * len, c + prof * (1 - 0.22 * Math.pow(Math.abs(Math.sin(t * Math.PI * 5 + 1.2)), 3))]);
    }
    var pts = L.concat(R.reverse()), d = "";
    pts.forEach(function (p, i) { d += (i ? " L" : "M") + f(p[0]) + " " + f(p[1]); });
    var rib = "M0 0";
    for (var j = 1; j <= 12; j++) { var tt = j / 12; rib += " L" + f(tt * len * 0.96) + " " + f(Math.sin(tt * Math.PI * 1.2) * w * 0.35); }
    return '<g transform="translate(' + x0 + " " + y0 + ") rotate(" + ang + ')"><g class="wk-leaf" data-o="' + x0 + " " + y0 + '">' +
      '<path class="wk-leaf__body" d="' + d + 'Z"/><path class="wk-leaf__rib" d="' + rib + '"/></g></g>';
  }
  function wijayakusuma(cx, cy, R, opts) {
    opts = opts || {};
    var out = "";
    if (opts.leaves) {
      out += leaf(cx - R * 0.2, cy + R * 0.25, 132, R * 1.6, R * 0.26) + leaf(cx + R * 0.15, cy + R * 0.1, 18, R * 1.45, R * 0.23) +
        leaf(cx, cy + R * 0.3, 74, R * 1.25, R * 0.2);
    }
    // tampak sedikit miring (3/4) seperti pada lukisan; putaran tetap di dalam bidang miring
    var tilt = opts.leaves ? ' transform="translate(' + cx + " " + cy + ") scale(1 .84) rotate(-8) translate(" + -cx + " " + -cy + ')"' : "";
    out += "<g" + tilt + '><g class="wk-head">';
    if (opts.mini) {
      out += ring(cx, cy, 8, 0, "wk-petal--outer", function () { return '<path class="wk-petal" d="' + petal(cx, cy, R * 0.95, R * 0.2, 0) + '"/>'; });
      out += ring(cx, cy, 5, 36, "wk-petal--inner", function () { return '<path class="wk-petal" d="' + petal(cx, cy, R * 0.55, R * 0.26, 0) + '"/>'; });
      return out + '<circle class="wk-core" cx="' + cx + '" cy="' + cy + '" r="' + f(R * 0.16) + '"/></g></g>';
    }
    // kelopak luar: panjang, tipis, melengkung bergantian (sepal bersemu merah muda)
    out += ring(cx, cy, 12, 8, "wk-petal--outer wk-sepal", function (i) {
      return '<path class="wk-petal" d="' + petal(cx, cy, R * (i % 2 ? 1.0 : 1.12), R * 0.06, i % 2 ? 0.22 : -0.18) + '"/>';
    });
    // kelopak putih lancip
    out += ring(cx, cy, 11, 0, "wk-petal--outer", function (i) {
      return '<path class="wk-petal" d="' + petal(cx, cy, R * (i % 3 ? 0.8 : 0.88), R * 0.21, (i % 2 ? 0.07 : -0.07)) + '"/>' +
        '<path class="wk-vein" d="M' + cx + " " + f(cy - R * 0.2) + " L" + cx + " " + f(cy - R * 0.62) + '"/>';
    });
    // bayangan kebiruan di dasar mahkota bunga (seperti pada lukisan)
    out += '<circle class="wk-shade" cx="' + cx + '" cy="' + cy + '" r="' + f(R * 0.5) + '"/>';
    // kelopak dalam lebar (mangkuk)
    out += ring(cx, cy, 8, 22, "wk-petal--inner", function () { return '<path class="wk-petal" d="' + petal(cx, cy, R * 0.58, R * 0.3, 0) + '"/>'; });
    out += ring(cx, cy, 6, 0, "wk-petal--inner wk-cup", function () { return '<path class="wk-petal" d="' + petal(cx, cy, R * 0.36, R * 0.24, 0, -R * 0.05) + '"/>'; });
    // pusat: benang sari kuning (pola biji bunga matahari)
    out += '<circle class="wk-core" cx="' + cx + '" cy="' + cy + '" r="' + f(R * 0.13) + '"/>';
    for (var s = 1; s <= 20; s++) {
      var a = s * 2.39996, rr = R * 0.2 * Math.sqrt(s / 20);
      out += '<circle class="wk-stamen" cx="' + f(cx + Math.cos(a) * rr) + '" cy="' + f(cy + Math.sin(a) * rr) + '" r="' + f(R * 0.028) + '"/>';
    }
    // putik merah muda melengkung keluar
    [[-62, 0.46], [-34, 0.4], [-96, 0.42], [-128, 0.34], [196, 0.3], [14, 0.32]].forEach(function (p) {
      var a = (p[0] * Math.PI) / 180, l = R * p[1], ex = cx + Math.cos(a) * l, ey = cy + Math.sin(a) * l;
      var mx = cx + Math.cos(a + 0.35) * l * 0.55, my = cy + Math.sin(a + 0.35) * l * 0.55;
      out += '<path class="wk-stamen wk-stigma" d="M' + cx + " " + cy + " Q" + f(mx) + " " + f(my) + " " + f(ex) + " " + f(ey) + '"/>' +
        '<circle class="wk-stamen wk-stigma__tip" cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(R * 0.03) + '"/>';
    });
    return out + "</g></g>";
  }
  function flowerSVG(opts) {
    opts = opts || {};
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + wijayakusuma(50, 50, opts.leaves ? 34 : opts.mini ? 46 : 47, opts) + "</svg>";
  }
  function flowerGroup(cx, cy, len, cls) {
    return '<g class="' + (cls || "") + '">' + wijayakusuma(cx, cy, len) + "</g>";
  }

  /* Mahkota gerbang — dipakai di gerbang & sebagai bingkai kartu. */
  var CROWN = "M40 205 C18 190 20 150 48 145 C50 120 78 108 98 118 C104 92 132 84 148 98 C150 70 170 56 186 62 " +
    "C188 34 212 34 214 62 C230 56 250 70 252 98 C268 84 296 92 302 118 C322 108 350 120 352 145 C380 150 382 190 360 205 Z";
  function crownRelief(cls) {
    cls = cls || "relief";
    var s = '<path class="' + cls + '" transform="translate(200 160) scale(.86 .8) translate(-200 -160)" d="' + CROWN + '"/>';
    [[76, 172, 12, 1, 0], [124, 142, 13, 1, 1], [276, 142, 13, -1, 2.1], [324, 172, 12, -1, 3.1], [44, 180, 10, -1, 0], [356, 180, 10, 1, 3.1]]
      .forEach(function (c) { s += '<path class="' + cls + '" d="' + spiral(c[0], c[1], c[2], 2, c[3], c[4]) + '"/>'; });
    // gulungan kecil di kaki mahkota
    s += '<path class="' + cls + '" d="M150 196 C156 176 176 172 186 186 M250 196 C244 176 224 172 214 186"/>';
    return s;
  }

  /* Batu Wadasan bermata spiral. */
  function rock(cx, cy, r, dir) {
    var d = "M" + f(cx - r) + " " + f(cy + r * 0.62) +
      " C" + f(cx - r * 1.05) + " " + f(cy - r * 0.3) + " " + f(cx - r * 0.45) + " " + f(cy - r) + " " + f(cx + dir * r * 0.1) + " " + f(cy - r * 1.18) +
      " C" + f(cx + r * 0.5) + " " + f(cy - r * 0.95) + " " + f(cx + r * 1.05) + " " + f(cy - r * 0.3) + " " + f(cx + r) + " " + f(cy + r * 0.62) + " Z";
    return '<path class="plaster relief-edge" d="' + d + '"/>' +
      '<path class="relief" transform="translate(' + cx + " " + cy + ") scale(.68) translate(" + -cx + " " + -cy + ')" d="' + d + '"/>' +
      '<path class="relief relief--eye" d="' + spiral(cx, cy - r * 0.05, r * 0.36, 1.8, dir, 0) + '"/>';
  }

  /* Gerbang Keraton (viewBox 400×620). */
  function gate(host) {
    var body = "M54 228 C66 330 46 450 12 604 L388 604 C354 450 334 330 346 228 Z";
    var arch = "M104 604 V318 C104 280 150 262 200 262 C250 262 296 280 296 318 V604 Z";
    var tiles = "";
    for (var x = 30; x < 372; x += 7) tiles += "M" + x + " 216 v10 ";
    var scallop = "M38 205";
    for (var sx = 38; sx < 362; sx += 12) scallop += " q6 -6 12 0";
    var rocks = "";
    [[40, 574, 30, 1], [86, 588, 20, -1], [34, 526, 20, -1], [74, 546, 15, 1]].forEach(function (r) {
      rocks += rock(r[0], r[1], r[2], r[3]) + rock(400 - r[0], r[1], r[2], -r[3]);
    });
    var diamonds = "";
    [[80, 340], [76, 440], [320, 340], [324, 440]].forEach(function (p) {
      diamonds += '<path class="tile" d="M' + p[0] + " " + (p[1] - 7) + " l7 7 l-7 7 l-7 -7z\"/>";
    });

    host.setAttribute("aria-hidden", "true");
    host.innerHTML =
      '<svg viewBox="0 0 400 620" preserveAspectRatio="xMidYMax meet">' +
      "<defs>" +
      '<radialGradient id="gate-inner" cx="50%" cy="18%" r="80%"><stop offset="0" stop-color="#5a4320"/><stop offset=".35" stop-color="#22223a"/><stop offset="1" stop-color="#0b1130"/></radialGradient>' +
      '<linearGradient id="plaster" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfbf6"/><stop offset="1" stop-color="#e8e2d4"/></linearGradient>' +
      '<radialGradient id="glow"><stop offset="0" stop-color="#ffd98a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      // isi pintu
      '<path d="' + arch + '" fill="url(#gate-inner)"/>' +
      '<path d="M104 572 H296 V604 H104Z" fill="#1a2040"/><path d="M104 572 H296" stroke="#3a4266" stroke-width="1.2"/>' +
      // lentera
      '<g class="gate__lantern"><path d="M200 262 V284" stroke="#8f6d22" stroke-width="1.2"/>' +
      '<circle class="gate__glow" cx="200" cy="296" r="34" fill="url(#glow)"/>' +
      '<path d="M193 286 h14 l3 6 v8 l-3 6 h-14 l-3 -6 v-8z" fill="#f0c060" stroke="#8f6d22" stroke-width="1"/></g>' +
      // badan + sayap
      '<path class="plaster relief-edge" fill-rule="evenodd" d="' + body + " " + arch + '"/>' +
      '<path class="relief" d="M70 236 C82 330 62 450 34 592 M330 236 C318 330 338 450 366 592"/>' +
      '<path class="relief relief--strong" d="M92 604 V316 C92 270 146 250 200 250 C254 250 308 270 308 316 V604"/>' +
      '<path class="relief" d="M86 318 H110 M290 318 H314"/>' +
      diamonds + rocks +
      // atap & cornice
      '<path d="M26 214 H374 V228 H26Z" fill="#2c3246"/><path d="' + tiles + '" stroke="#4b536e" stroke-width="1.4"/>' +
      '<path class="plaster relief-edge" d="M34 194 H366 V214 H34Z"/><path class="relief" d="' + scallop + '"/>' +
      // mahkota
      '<path class="plaster relief-edge" d="' + CROWN + '"/>' +
      '<g class="gate__crown-relief">' + crownRelief("relief relief--draw") + "</g>" +
      flowerGroup(200, 118, 34, "wk gate__flower") +
      "</svg>";
  }

  /* Bingkai kartu: siluet mahkota bergaris emas, diisi warna kertas. */
  function crownFrame(host) {
    host.setAttribute("aria-hidden", "true");
    host.innerHTML =
      '<svg viewBox="10 30 380 182" preserveAspectRatio="xMidYMax meet">' +
      '<path class="wd-fill" d="' + CROWN + '"/>' +
      '<path class="wd-line" d="' + CROWN + '"/>' + crownRelief("wd-line wd-line--2") + "</svg>";
  }

  window.Orn = { spiral: spiral, flowerSVG: flowerSVG, gate: gate, crownFrame: crownFrame, NS: NS };
})();
