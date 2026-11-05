# Undangan Digital — Cirebon × Cilacap

Undangan pernikahan berbasis web dengan tema **langit Cirebon bertemu laut Cilacap**. Tamu disambut **Gerbang Keraton Kasepuhan** (mahkota awan, kaki Wadasan bermata spiral) di bawah langit **Mega Mendung**, lalu "masuk" melewati pintunya. Di dalam ada bunga **Wijayakusuma** (mekar lapis demi lapis dengan daun pipihnya) dan ombak **Teluk Penyu**, lengkap dengan motion sinematik (GSAP).

Situs ini sepenuhnya statis: tanpa database, tanpa build, dan tanpa CDN. Cukup upload foldernya ke hosting.

---

## 1. Coba di komputer

```bash
cd undangan-digital
python3 -m http.server 8080
```

Buka <http://localhost:8080/?to=Budi%20Santoso>. Tekan `Ctrl+C` di terminal untuk menghentikan server.

> Membuka `index.html` dengan klik dua kali (`file://`) juga bisa, tetapi tombol **Salin** di amplop paling andal saat dibuka lewat `http(s)://`.

## 2. Ganti isi undangan

Semua isi ada di **`assets/js/data.js`**. Edit file ini saja, tidak perlu menyentuh HTML.

| Bagian | Yang diubah |
|---|---|
| Mempelai | `mempelai.pria` / `mempelai.wanita`: panggilan, nama lengkap, keterangan ("Putra pertama dari"), ayah, ibu, asal |
| Tanggal cover | `tanggalUtama` → `"2026-12-13T08:00"` |
| Acara | `acara[]`: nama, `mulai`, `selesai` (isi `null` jika "selesai"), tempat, alamat, `maps` (link Google Maps) |
| Galeri | `galeri[]`: `{ src, alt }`. Kosongkan `[]` untuk menyembunyikan bagian ini |
| Amplop | `amplop[]`: bank, nomor, atasNama. `qris` diisi path gambar (opsional) |
| Musik | `musik` → path mp3. Kosongkan `""` untuk mematikan |
| Teks | `teks.*`: salam, ayat, pengantar, penutup |

Zona waktu default adalah WIB (`zonaWaktu`). Untuk WITA atau WIT, ubah `label`, `offset`, dan `iana` (mis. `"WITA"`, `"+08:00"`, `"Asia/Makassar"`).

**Link Google Maps:** buka lokasi di Google Maps → **Bagikan** → **Salin link**, lalu tempel ke `maps`.

## 3. Foto, musik, QRIS

- **Foto:** taruh di `assets/img/gallery/` (JPG/WebP, sisi terpanjang ±1600 px, < 300 KB per foto agar cepat), lalu tulis path-nya di `galeri`. Foto contoh `contoh-*.svg` boleh dihapus.
  Pola grid per 6 foto: foto 1 tinggi (cocok potret), foto 4 lebar penuh (cocok lanskap), sisanya kotak.
- **Musik:** taruh file sebagai `assets/audio/musik.mp3` (atau ubah path di `musik`). Musik mulai saat tamu menekan **Buka Undangan**. Jika file tidak ada, tombol musik otomatis disembunyikan.
- **QRIS:** taruh gambar (mis. `assets/img/qris.png`) lalu isi `qris: "assets/img/qris.png"`.

## 4. Tautan untuk setiap tamu

Tambahkan `?to=` dan nama tamu di akhir alamat. Spasi boleh ditulis `%20` atau `+`:

```
https://domain-anda.com/?to=Budi+Santoso
https://domain-anda.com/?to=Keluarga%20Besar%20Bapak%20Ahmad
```

Tanpa `?to=`, cover menampilkan "Bapak/Ibu/Saudara/i". Nama tamu dibatasi 60 karakter dan selalu ditampilkan sebagai teks biasa, jadi aman meskipun berisi karakter aneh.

## 5. Upload ke hosting

Upload **seluruh isi folder** ini (kecuali `.specflow/`, yang berisi spec dan foto referensi, serta `README.md`, yang opsional) ke folder web hosting Anda, misalnya `public_html/` di cPanel atau `/var/www/...` di VPS. `index.html` harus berada di root folder tersebut.

- Gunakan **HTTPS** agar tombol Salin dan musik bekerja paling baik.
- Tidak perlu PHP, Node, atau database.
- Setelah upload, coba `https://domain-anda.com/?to=Tes` dari HP.

## 6. Struktur

```
index.html              kerangka halaman + sprite awan Mega Mendung
assets/js/data.js       ← ISI UNDANGAN (edit di sini)
assets/js/ornaments.js  gambar SVG: Gerbang Keraton, mahkota Wadasan, Wijayakusuma
assets/js/main.js       render data, nama tamu, musik, galeri, amplop
assets/js/motion.js     semua animasi GSAP + ScrollTrigger
assets/css/style.css    warna (token di :root), tata letak
assets/vendor/gsap/     GSAP 3.12.5 (lokal)
assets/fonts/           Cormorant Garamond, Pinyon Script, Amiri (lokal, OFL)
assets/img/             favicon, tekstur batik, foto galeri
assets/audio/           taruh musik.mp3 di sini
```

**Warna:** ubah token `--indigo-*`, `--emas*`, `--krem`, dan `--kertas` di bagian atas `style.css`. Warna awan Mega Mendung diatur oleh `--mm-1` (garis luar), `--mm-line` (garis krem), `--mm-2`…`--mm-4` (pita terang → tua), dan `--mm-5` (inti).

## 7. Aksesibilitas & performa

- Pengguna dengan pengaturan **kurangi gerakan** (reduce motion) melihat semua konten tanpa parallax atau animasi berulang.
- Jika GSAP gagal dimuat, undangan tetap terbuka dan semua konten tampil.
- Halaman awal ±350 KB (tanpa foto asli dan musik). Ornamen semuanya SVG, tanpa gambar raster.

## Lisensi pihak ketiga

- GSAP: lisensi standar GSAP (gratis, termasuk ScrollTrigger), <https://gsap.com/standard-license>
- Motif Mega Mendung: bentuk dari file "Ragam Hias Sunda Mega Mendung.svg" yang diberikan pemilik. Pastikan izin penggunaannya sesuai sumber file tersebut.
- Font Cormorant Garamond, Pinyon Script, Amiri: SIL Open Font License 1.1 (`assets/fonts/LICENSE-OFL.txt`)
