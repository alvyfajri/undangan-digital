# Undangan Digital — project context

Undangan pernikahan digital berbasis web untuk **satu pasangan**, bertema perpaduan budaya Jawa **Cirebon** (Mega Mendung, Wadasan) dan **Cilacap** (bunga Wijayakusuma, ombak Teluk Penyu), dengan motion sinematik. Tamu membuka tautan pribadi (`?to=Nama`), membuka undangan, lalu melihat salam, detail acara, galeri, dan amplop digital. Hasil akhirnya situs statis yang siap di-upload ke hosting milik sendiri.

## Purpose and expected outcome
- Purpose: menyampaikan undangan pernikahan secara digital dengan identitas budaya kedua keluarga.
- Agreed delivery outcome: situs statis lengkap berisi data contoh. Pemilik cukup mengganti satu file data, foto, dan musik, lalu meng-upload folder ke hosting.

## Users and simple flow
- Users: tamu undangan, mayoritas membuka dari HP melalui tautan WhatsApp. Pemilik/mempelai mengedit konten.
- Main flow: tautan `?to=Nama` → cover dengan nama tamu → "Buka Undangan" (animasi pembuka + musik) → scroll: salam & ayat → acara + peta + kalender → galeri → amplop → penutup.

## Existing system and conventions
Situs statis di `/Users/user/MyProjects/undangan-digital`, belum memakai git. Konvensi: konten hanya di `assets/js/data.js`, render via `textContent`, motion terpusat di `assets/js/motion.js`, token warna di `:root` pada `style.css`.

## Product and technical foundations

| Area | Choice or current fact | State | Basis |
|---|---|---|---|
| Repository | Situs statis (index.html + assets/), belum memakai git | Verified | Implementasi 2026-11-05 |
| Platform and client | Web mobile-first, tetap rapi di desktop | Confirmed | Jawaban user |
| Language | HTML, CSS, JavaScript vanilla (script klasik `defer`, agar juga jalan via `file://`) | Confirmed | Jawaban user |
| Framework | Tanpa framework. Animasi memakai GSAP + ScrollTrigger | Confirmed | Jawaban user |
| Runtime | Browser modern (Chrome Android, Safari iOS 15+). Tidak perlu server-side | Assumed | Situs statis |
| Storage and data ownership | Tidak ada database. Konten ada di `assets/js/data.js` milik pemilik | Confirmed | Tanpa RSVP |
| Identity and access | N/A. Undangan publik, nama tamu hanya tampilan dari URL | Confirmed | Lingkup satu pasangan |
| Hosting and operation | Hosting/domain milik user, cukup upload file statis | Confirmed | Jawaban user |
| Integrations | Tautan keluar ke Google Maps dan Google Calendar saja. GSAP dan font disimpan lokal | Confirmed / Assumed (kalender) | Jawaban user |

## Run and verify
- Verified 2026-11-05: `python3 -m http.server 8080` di root proyek → `http://localhost:8080/?to=Budi%20Santoso`. Membuka `index.html` langsung (`file://`) juga berfungsi.
- Tidak ada build atau dependensi runtime. Panduan edit, aset, dan upload ada di [README.md](../README.md).
- Pemeriksaan yang dijalankan: Chrome headless (puppeteer-core) untuk perjalanan utama, AC1–AC10, reduced-motion, tanpa GSAP, mobile 390/360 px, dan desktop 1440 px. Belum diuji di perangkat fisik atau hosting user.

## Constraints and workflow preferences
- Bahasa: Indonesia saja (Confirmed).
- Semua aset bersifat lokal, tanpa CDN (Confirmed).
- Hormati `prefers-reduced-motion`. Kontras teks harus terbaca di atas ornamen.
- Ringan di HP kelas menengah: total halaman awal tanpa foto galeri ditargetkan < 1 MB (Proposed).
- Nama tamu dari URL selalu dirender sebagai teks, tidak pernah sebagai HTML.

## Specs history

| Spec | Scope | Status | Link |
|---|---|---|---|
| Undangan Cirebon–Cilacap | Situs undangan lengkap dengan motion | completed (owner acceptance pending) | [tasks.md](specs/undangan-cirebon-cilacap/tasks.md) |
