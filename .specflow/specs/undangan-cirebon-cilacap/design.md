# Design — Undangan Cirebon–Cilacap

## Experience reference
`artifacts/cover-prototype.html` adalah contoh cover dan animasi pembuka (CSS saja, data contoh).
Provenance: **sample**. Ini referensi arah visual, bukan kode aplikasi final.

## Konsep visual: "Langit Cirebon bertemu Laut Cilacap"
- **Cirebon (langit, atas):** awan Mega Mendung dengan 5–7 gradasi indigo, garis tepi berlapis, dan batu Wadasan sebagai bingkai bawah ornamen.
- **Cilacap (laut, bawah):** bunga Wijayakusuma (putih krem, kelopak panjang) dan ombak Teluk Penyu bergaya garis batik.
- **Makna:** awan turun bertemu laut, melambangkan dua keluarga yang menyatu. Bagian acara menjadi titik temu kedua motif.
- **Palet (token CSS):** `--indigo-900 #14204a`, `--indigo-700 #23376e`, `--indigo-500 #3d5a9e`, `--indigo-300 #8ea3d1`, `--emas #c9a24a`, `--emas-terang #e6c878`, `--krem #f5ecd9`, `--kertas #faf5ea`, `--tinta #1d1a16`.
- **Tipografi (lokal, OFL):** *Cormorant Garamond* untuk judul dan isi, *Pinyon Script* untuk nama mempelai, *Amiri* untuk ayat Arab.
- **Ornamen:** semuanya SVG inline atau sprite (tanpa gambar raster), sehingga tajam di semua layar dan ringan.

## Urutan layar
1. **Cover** (fixed, layar penuh): awan atas-bawah, judul "Undangan Pernikahan", nama mempelai, "Kepada Yth. {tamu}", tombol emas "Buka Undangan".
2. **Pembuka → Salam**: awan tersibak ke kiri dan kanan, Wijayakusuma mekar di tengah, lalu salam, ayat Ar-Rum 21, dan nama mempelai + orang tua (asal Cirebon / Cilacap).
3. **Acara**: kartu akad dan resepsi berbingkai Wadasan emas, dengan tombol "Lihat Peta" dan "Simpan ke Kalender". Latar beralih dari langit (indigo) ke laut (ombak).
4. **Galeri**: grid tidak beraturan berisi 6–9 foto, dengan lightbox.
5. **Amplop digital**: kartu rekening bergaya kartu emas dengan tombol Salin, plus QRIS opsional.
6. **Penutup**: ucapan terima kasih, nama mempelai, dan ombak di dasar halaman.
- Elemen tetap: tombol musik (bulat, motif Wijayakusuma, berputar saat bermain).

## Motion (GSAP + ScrollTrigger)
| Momen | Gerak |
|---|---|
| Cover idle | Awan bergeser pelan (drift ±10 px, loop), cahaya emas lembut di tombol |
| Buka undangan | Timeline sekitar 2 detik: awan kiri/kanan bergeser keluar + scale, cover memudar, Wijayakusuma mekar (kelopak berputar dari 0), judul salam naik |
| Scroll umum | `fade-up` bertahap per elemen (`data-reveal`), ornamen awan dengan parallax `scrub` |
| Acara | Bingkai Wadasan tergambar (stroke-dashoffset), kartu muncul bergantian |
| Laut | Ombak bergerak horizontal (loop, berhenti saat di luar layar) |
| Galeri/amplop | Stagger masuk; lightbox scale dan fade |
- **Reduced motion:** dengan `gsap.matchMedia()`, hanya opacity yang dianimasikan; parallax dan loop dinonaktifkan.
- **Tanpa GSAP:** kelas `.no-js-motion` membuat semua `[data-reveal]` langsung terlihat.
- **Performa:** hanya `transform`/`opacity` yang dianimasikan; loop dijeda di luar viewport.

## Struktur teknis
```text
index.html              # kerangka semua section (diisi dari data)
assets/css/style.css    # token, layout, komponen
assets/js/data.js       # SATU-SATUNYA file yang diedit pemilik
assets/js/main.js       # render data, nama tamu, musik, galeri, amplop
assets/js/motion.js     # semua timeline GSAP
assets/vendor/gsap/     # gsap.min.js, ScrollTrigger.min.js (lokal)
assets/fonts/           # woff2 lokal
assets/img/ornaments.svg, assets/img/gallery/, assets/audio/ (kosong)
README.md               # cara edit, isi foto/musik, upload
```
- **Render:** `main.js` membaca `window.WEDDING` dari `data.js` lalu mengisi elemen dengan `textContent` (aman untuk AC1). Bagian dengan data kosong tidak dirender.
- **Kalender:** URL `calendar.google.com/calendar/render?action=TEMPLATE&text=…&dates=…&location=…`. Waktu WIB dikonversi ke UTC (Assumed).
- **Musik:** `<audio preload="none">`. Mulai bermain dipicu tap "Buka Undangan" sehingga lolos kebijakan autoplay. Event `error` menyembunyikan tombol.
- **Foto placeholder:** gradien SVG bermotif sebagai pengganti foto, diganti user nanti.
- **Data/privasi:** tidak ada data tamu yang dikirim ke mana pun. Nomor rekening memang publik di undangan (keputusan pemilik).

## Decisions
- Confirmed: semua pilihan di requirements.
- Assumed: font Cormorant Garamond / Pinyon Script / Amiri; Google Calendar link; placeholder SVG untuk foto.
- Proposed: budget halaman awal < 1 MB.

## Revisi dari referensi (2026-11-05)
Referensi: `artifacts/referensi/` (batik dan motif Mega Mendung, Gerbang Keraton Kasepuhan, dan lukisan bunga Wijayakusuma). Keduanya hanya acuan bentuk; semua digambar ulang sebagai SVG (Confirmed).
- **Cover = Gerbang Keraton** (Confirmed): langit berisi nama mempelai dan tanggal; gerbang putih di bawahnya dengan mahkota awan dan relief spiral, medalion Wijayakusuma emas, atap, sayap melebar, ubin biru, kaki Wadasan bermata spiral, dan lentera di pintu lengkung. Nama tamu dan tombol ada di dalam pintu. Lebar gerbang mengikuti tinggi layar (`70dvh`) agar selalu muat; ukuran teks pintu memakai `cqw`.
- **Masuk gerbang:** konten memudar, lentera membesar, awan tersibak, kamera zoom ±3,8× ke arah pintu, cahaya kertas memenuhi pintu, lalu bagian salam tampil (sekitar 2,4 detik).
- **Mega Mendung (bentuk asli, Confirmed):** bentuk awan diambil langsung dari `artifacts/referensi/mega-mendung-ragam-hias.svg` (file pemilik). Tiga awan utuh dijadikan simbol sprite `#mm`, `#mm-2`, dan `#mm-3`, lalu diwarnai lewat CSS: garis luar gelap, inti navy, pita biru terang→tua di sepanjang garis (di-clip ke awan), dan garis krem di atasnya. Pola penuh, yang tersambung mulus, dipakai sebagai tekstur samar `mega-mendung-tile.svg`.
- **Bingkai Wadasan:** kartu acara dan ayat memakai siluet mahkota gerbang bergaris emas yang tergambar saat muncul.
- **Wijayakusuma:** satu generator (`ornaments.js`) untuk semua bunga. Lapisan: kelopak luar panjang-tipis bersemu merah muda, kelopak putih lancip bertulang, bayangan kebiruan, kelopak dalam lebar membentuk mangkuk, benang sari kuning, dan putik merah muda. Bunga salam dan penutup diberi daun pipih bergelombang indigo dan tampak miring 3/4. Mekar: daun tumbuh, lalu kelopak terbuka lapis demi lapis; bunga berputar sangat pelan dan daun bergoyang.
