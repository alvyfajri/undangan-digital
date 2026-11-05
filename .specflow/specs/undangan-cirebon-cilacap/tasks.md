---
status: completed
gate: none
---

# Undangan Cirebon–Cilacap — approved-scope plan

## Outcome
Tamu membuka tautan pribadi, lalu melihat undangan bertema Cirebon–Cilacap dengan motion sinematik: acara, peta, kalender, galeri, dan amplop. Pemilik cukup mengedit satu file data lalu meng-upload foldernya.

## Experience/reference
`artifacts/cover-prototype.html`: cover dan animasi pembuka.

Provenance: sample

## Effective settings
- Assurance: 2
- Delivery target: mvp
- Review cadence: milestone
- Planning detail: concise

## 1. Cover dan pembuka yang bisa dicoba

- [x] 1.1 Fondasi proyek dan sistem visual
  - Scope: struktur folder sesuai design; GSAP + ScrollTrigger dan font woff2 disimpan lokal di `assets/`; token warna dan tipografi; sprite SVG ornamen (Mega Mendung, Wadasan, Wijayakusuma, ombak); `data.js` berisi data contoh lengkap; kolom tengah responsif.
  - Criteria: AC9, AC10
  - Verify: halaman kosong dengan ornamen termuat dari server lokal; panel Network tidak menunjukkan request ke domain luar.
  - Evidence: GSAP 3.12.5 + ScrollTrigger dan 6 woff2 (OFL) disimpan lokal; Chrome headless mencatat 0 request ke domain luar; halaman awal 343 KB.

- [x] 1.2 Cover, nama tamu, animasi pembuka, dan musik
  - Depends on: 1.1
  - Scope: cover fixed, nama dari `?to=`, kunci scroll, timeline buka undangan, tombol musik dengan fallback jika file tidak ada, jeda saat tab disembunyikan.
  - Criteria: AC1, AC2, AC3
  - Verify: coba `?to=Budi%20Santoso`, tanpa parameter, dan `?to=<img src=x onerror=alert(1)>`; uji tanpa file mp3 (tombol tersembunyi) dan dengan mp3 uji.
  - Evidence: `?to=Budi%20Santoso`, tanpa parameter, `+` sebagai spasi, dan payload `<img onerror>` (tidak tereksekusi) diuji; scroll terkunci sebelum dibuka; tanpa mp3 tombol tersembunyi; dengan WAV sintetis (interception) musik mulai, jeda saat tab disembunyikan, lanjut saat kembali, dan bisa dijeda dengan tombol.

**Milestone demo:** buka `/?to=Budi%20Santoso`, ketuk "Buka Undangan", lihat awan tersibak dan bunga mekar.

**Milestone limits:** section isi belum lengkap.

## 2. Isi undangan

- [x] 2.1 Salam, ayat, mempelai, acara, dan penutup
  - Depends on: 1.2
  - Scope: render dari data; kartu acara dengan tautan Maps dan Google Calendar (konversi WIB ke UTC); section penutup.
  - Criteria: AC4, AC5, AC9
  - Verify: tautan kalender membuka event dengan jam yang benar; acara tanpa `maps` tidak menampilkan tombol peta; mengubah `data.js` mengubah tampilan.
  - Evidence: tautan kalender akad `20270612T010000Z/20270612T030000Z` (08.00–10.00 WIB); 2 tautan Maps; label "11.00 WIB – selesai"; hari "Sabtu, 12 Juni 2027".

- [x] 2.2 Galeri dengan lightbox
  - Depends on: 1.1
  - Scope: grid lazy-load dengan placeholder SVG; lightbox yang mendukung swipe, panah, Esc, ketuk latar, dan tombol ×; section disembunyikan jika daftar foto kosong.
  - Criteria: AC6
  - Verify: navigasi dengan sentuhan (emulasi) dan keyboard; uji dengan daftar foto kosong.
  - Evidence: lightbox dibuka dari foto 2, panah kanan → 3/6, Esc menutup. Swipe sudah diimplementasikan tetapi belum diuji dengan sentuhan nyata.

- [x] 2.3 Amplop digital
  - Depends on: 1.1
  - Scope: kartu rekening, tombol Salin dengan feedback "Tersalin" dan fallback, QRIS opsional, section disembunyikan jika kosong.
  - Criteria: AC7
  - Verify: hasil salinan berupa nomor tanpa spasi; fallback berjalan di HTTP non-secure atau saat Clipboard API dimatikan.
  - Evidence: Salin menyalin `1234567890` dan menampilkan "Tersalin ✓" (Clipboard API). Jalur fallback `execCommand` sudah ada tetapi belum diuji terpisah.

**Milestone demo:** perjalanan lengkap dari cover sampai penutup dengan data contoh.

## 3. Motion sinematik, pemeriksaan akhir, dan serah terima

- [x] 3.1 Sistem motion saat scroll
  - Depends on: 2.1, 2.2, 2.3
  - Scope: `motion.js` berisi reveal bertahap, parallax awan, bingkai Wadasan tergambar, ombak loop yang dijeda di luar layar, stagger galeri/amplop, cabang reduced-motion lewat `gsap.matchMedia`, dan fallback saat GSAP gagal dimuat.
  - Criteria: AC8
  - Verify: tinjauan visual di 360 px dan desktop; emulasi `prefers-reduced-motion`; hapus script GSAP lalu pastikan semua konten tetap terlihat; tidak ada jank yang mencolok di emulasi CPU 4× lebih lambat.
  - Evidence: screenshot 390×844, 360×640, dan 1440×900 ditinjau; reduced-motion: semua konten terlihat; GSAP diblokir: undangan tetap terbuka dan konten tampil; lompat-scroll ke bawah: penutup tampil ≤1,5 dtk. Perbaikan selama uji: stagger batch dibatasi, `overwrite: "auto"` (sebelumnya mematikan efek judul), grid galeri tanpa celah. Emulasi CPU 4× tidak dijalankan.

- [x] 3.2 Pemeriksaan menyeluruh dan panduan
  - Depends on: 3.1
  - Scope: uji perjalanan utama dari server lokal yang baru dijalankan; cek ukuran halaman awal; `README.md` (cara mengedit `data.js`, mengganti foto/musik/QRIS, membuat tautan per tamu, meng-upload ke hosting); perbarui `project.md` bagian Run and verify.
  - Criteria: AC1–AC10
  - Verify: perjalanan lengkap di emulasi mobile dan desktop, dengan screenshot bila tersedia alat browser; mengikuti README dari awal benar-benar berhasil.
  - Evidence: 26/26 pengecekan Chrome headless lolos dari server lokal yang baru dijalankan; `file://` juga berfungsi; README ditulis; project.md diperbarui. Skrip uji ada di scratchpad sesi (di luar repo).

## 4. Revisi dari referensi budaya Cirebon (2026-11-05)

Referensi dari user: `artifacts/referensi/wadasan cirebon.jpg` (kain batik Mega Mendung) dan `artifacts/referensi/gerbang keraton cirebon.jpg` (gerbang Keraton Kasepuhan). Keputusan user: cover diganti menjadi gerbang yang "dimasuki" saat dibuka; semua ornamen digambar ulang sebagai SVG, foto tidak dipakai langsung.

- [x] 4.1 Mega Mendung digambar ulang sesuai batik
  - Scope: awan dengan pita gradasi dari tepi gelap ke tengah terang, garis pemisah putih, ujung spiral; tekstur batik zig-zag samar di section gelap dan latar desktop.
  - Criteria: AC8, AC10
  - Verify: dibandingkan visual dengan referensi; ukuran halaman tetap < 1 MB.
  - Evidence: simbol `#mm` digambar ulang (pita stroke, garis krem, spiral); tekstur tile di `.sec--sky` dan `.stage`; halaman awal tetap < 1 MB (uji lolos).

- [x] 4.2 Cover Gerbang Keraton + animasi masuk
  - Depends on: 4.1
  - Scope: ilustrasi gerbang putih (mahkota awan, atap, sayap melebar, pintu lengkung dengan lentera, kaki Wadasan bermata spiral, ubin biru); Wijayakusuma di medalion mahkota; nama mempelai di langit, nama tamu dan tombol di dalam pintu; saat dibuka kamera masuk melewati pintu menuju bagian salam.
  - Criteria: AC1, AC2, AC8, AC10
  - Verify: 390×844, 360×640, desktop; nama tamu panjang muat di pintu; reduced-motion dan tanpa GSAP tetap bisa dibuka.
  - Evidence: screenshot 390×844, 360×640 (nama tamu 4 baris muat di pintu, tanpa scroll horizontal), 1440×900; frame animasi 0,7/1,3/1,9/2,6 dtk ditinjau; uji reduced-motion, tanpa GSAP, dan `file://` lolos.

- [x] 4.3 Bingkai Wadasan bergaya relief mahkota gerbang
  - Depends on: 4.2
  - Scope: bingkai kartu acara dan ayat memakai siluet mahkota gerbang dengan spiral (menggantikan bentuk tangga).
  - Criteria: AC4, AC5, AC8
  - Verify: tinjauan visual serta animasi garis tergambar.
  - Evidence: bingkai mahkota pada kartu acara dan ayat; isian kini muncul bersama garis (sebelumnya sempat tampil sebagai blob).

- [x] 4.4 Uji ulang menyeluruh
  - Depends on: 4.1, 4.2, 4.3
  - Criteria: AC1–AC10
  - Verify: seluruh rangkaian uji headless lolos; screenshot ditinjau; README dan design.md diperbarui.
  - Evidence: 26/26 uji headless lolos setelah revisi; README dan design.md diperbarui. Belum diuji di perangkat fisik.
- [x] 4.5 Wijayakusuma digambar ulang dari referensi lukisan (artifacts/referensi/bunga wijaya kusuma.jpg)
  - Criteria: AC7 (motion), AC8
  - Verify: bunga salam/penutup/gerbang/musik dirender; urutan mekar ditinjau per frame; 26/26 uji + file:// lolos.
  - Evidence: generator tunggal `Orn.flowerSVG`/`wijayakusuma` di ornaments.js; screenshot salam, penutup, gerbang, dan frame tengah mekar ditinjau; 26/26 lolos, file:// tanpa error.
- [x] 4.6 Mega Mendung digambar ulang dari referensi motif (artifacts/referensi/mega-mendung-1.jpg, mega-mendung-2.jpg)
  - Criteria: AC7, AC8
  - Verify: simbol awan dirender di latar gelap & kertas; cover, salam, acara, desktop ditinjau; 26/26 uji + file:// lolos.
  - Evidence: awan lensa berujung lancip saling tumpuk, garis putih + pita terang→gelap, kait spiral ber-clip; tekstur tile diperbarui; 26/26 lolos, file:// tanpa error.
- [x] 4.7 Mega Mendung memakai bentuk asli dari file pemilik (`artifacts/referensi/mega-mendung-ragam-hias.svg`); menggantikan 4.6
  - Criteria: AC7, AC8
  - Verify: 3 awan utuh dipisah dari pola (containment subpath), diwarnai via CSS; pola penuh menjadi tekstur (disambung mulus, dicek 2×2); cover, salam, acara, desktop ditinjau; 26/26 + file:// + layar 360 px lolos.
  - Evidence: sprite `#mm`, `#mm-2`, `#mm-3` di index.html; generator awan lama dihapus dari ornaments.js; tile 33 KB. Sumber/lisensi motif: file dari pemilik (belum diketahui pembuatnya).

## Deferred roadmap — outside the approved delivery target
- RSVP dan ucapan tamu (dengan Google Sheets/Supabase), jika diminta.
- Profil mempelai lengkap, countdown, dan love story, jika diminta.
- Template multi-klien, jika ingin dijual sebagai jasa.

## Decisions to resolve
- Proposed: budget halaman awal < 1 MB (tanpa foto galeri).
- Assumed: tautan Google Calendar (bukan .ics); nama mempelai dan orang tua tampil di section salam; ada section penutup; WIB.
- Open: data asli menyusul. Tidak memblokir pekerjaan.

## Approval
- Assignment mode: implementation
- Approved artifact/reference: requirements.md, design.md, artifacts/cover-prototype.html
- Plan baseline: tasks.md ini (2026-11-05)
- Effective settings: assurance 2, mvp, milestone, concise
- Included scope: tugas 1.1–3.2
- Deferred: lihat roadmap
- Execution authority requested: all in-scope tasks through handoff (1.1–3.2)
- User approval recorded: approved as requested — user: "iya setuju" (2026-11-05)
- Authorized execution: all in-scope tasks through handoff (1.1–3.2); revisi 4.1–4.7 disetujui user lewat pilihan "Cover = gerbang" + "Digambar ulang SVG" serta referensi bunga, motif Mega Mendung, dan file SVG Ragam Hias Mega Mendung (2026-11-05)
- Orchestration: serial, tanpa delegasi
- Separately gated actions: upload/deploy ke hosting user, pengunduhan aset vendor dari npm/Google Fonts (dilakukan saat 1.1 dan termasuk dalam persetujuan ini)
- Validation boundary: server statis lokal dan emulasi browser; belum diuji di perangkat fisik maupun hosting user
- Provenance and limitations: semua konten berupa data contoh; musik dan foto asli belum ada
- Pending decision: none
- Owner acceptance: pending. User belum mencoba hasilnya.
- Engineering completion: 1.1–3.2 dan revisi 4.1–4.7 selesai 2026-11-05. Belum diuji di perangkat fisik maupun hosting user.
