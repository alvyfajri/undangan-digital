# Requirements — Undangan Cirebon–Cilacap

## Outcome
Tamu yang membuka tautan pribadinya melihat undangan yang terasa personal dan berbudaya, langsung tahu **kapan dan di mana** acaranya, bisa membuka peta, menyimpan jadwal ke kalender, melihat galeri, dan mengirim hadiah lewat amplop digital. Mempelai mengganti seluruh konten hanya dari satu file data.

## Contoh perjalanan utama
Budi menerima tautan `https://domain-anda/?to=Budi%20Santoso` di WhatsApp. Cover menampilkan *"Kepada Yth. Budi Santoso"* di antara awan Mega Mendung. Budi mengetuk **Buka Undangan**: awan tersibak seperti gerbang, bunga Wijayakusuma mekar, dan musik mulai. Saat scroll, ia membaca salam dan QS Ar-Rum 21, lalu melihat jadwal akad dan resepsi. Ia mengetuk **Lihat Peta** (Google Maps terbuka) dan **Simpan ke Kalender**. Setelah itu ia melihat galeri, menyalin nomor rekening di bagian amplop, dan menutup undangan setelah membaca ucapan terima kasih.

## Termasuk di rilis ini
Cover dengan nama tamu, animasi pembuka, musik latar, salam dan ayat beserta nama mempelai, detail acara dengan peta dan kalender, galeri dengan lightbox, amplop digital, penutup, motion sinematik saat scroll, dan file data tunggal.

## Ditunda / di luar lingkup
- RSVP dan ucapan/doa tamu (Deferred, perlu backend). Dipertimbangkan lagi jika user meminta.
- Profil mempelai lengkap dan countdown (Deferred, tidak dipilih). Nama mempelai dan orang tua tetap tampil singkat di bagian salam (Assumed).
- Love story, multi-bahasa, template multi-klien, dan dashboard admin (Deferred).
- Deploy ke hosting dilakukan sendiri oleh user. Saya hanya menyiapkan panduan.

## Acceptance criteria

**AC1 — Nama tamu**
- WHEN halaman dibuka dengan parameter `?to=`, THE SYSTEM SHALL menampilkan nilai yang sudah di-decode (dan `+` diubah menjadi spasi) di cover, maksimal 60 karakter.
- IF parameter `to` tidak ada atau kosong, THEN THE SYSTEM SHALL menampilkan "Bapak/Ibu/Saudara/i".
- THE SYSTEM SHALL merender nama tamu sebagai teks biasa. Contoh negatif: `?to=<img src=x onerror=alert(1)>` tampil sebagai tulisan dan tidak dieksekusi.

**AC2 — Pembuka**
- WHILE cover masih tampil, THE SYSTEM SHALL mengunci scroll konten undangan.
- WHEN tamu mengetuk "Buka Undangan", THE SYSTEM SHALL memainkan animasi awan tersibak (sekitar 1,5–2,5 detik), membuka scroll, dan memulai musik.

**AC3 — Musik**
- WHILE musik tersedia, THE SYSTEM SHALL menampilkan tombol putar/jeda melayang yang statusnya terlihat (berputar saat musik bermain).
- IF file musik tidak ada atau gagal diputar, THEN THE SYSTEM SHALL menyembunyikan tombol musik tanpa menampilkan error.
- WHEN tab disembunyikan, THE SYSTEM SHALL menjeda musik, lalu melanjutkannya saat tab kembali jika sebelumnya sedang bermain.

**AC4 — Salam, ayat, mempelai, penutup**
- THE SYSTEM SHALL menampilkan salam pembuka, QS Ar-Rum 21 (teks Arab dan terjemahan), nama kedua mempelai beserta orang tua dan asal daerahnya, serta bagian penutup berisi ucapan terima kasih.

**AC5 — Acara**
- THE SYSTEM SHALL menampilkan setiap acara (akad, resepsi) dengan hari, tanggal, jam, nama tempat, dan alamat.
- WHEN tamu mengetuk "Lihat Peta", THE SYSTEM SHALL membuka tautan Google Maps acara tersebut di tab baru.
- WHEN tamu mengetuk "Simpan ke Kalender", THE SYSTEM SHALL membuka Google Calendar dengan judul, waktu (WIB), dan lokasi yang sudah terisi.
- IF suatu acara tidak memiliki tautan peta, THEN THE SYSTEM SHALL menyembunyikan tombol peta untuk acara itu.

**AC6 — Galeri**
- THE SYSTEM SHALL menampilkan foto dari file data dalam grid yang dimuat secara lazy.
- WHEN foto diketuk, THE SYSTEM SHALL membuka lightbox yang bisa digeser (swipe atau panah) dan ditutup dengan tombol ×, Esc, atau ketuk latar.
- IF daftar foto kosong, THEN THE SYSTEM SHALL menyembunyikan bagian galeri.

**AC7 — Amplop digital**
- THE SYSTEM SHALL menampilkan setiap rekening atau e-wallet (bank, nomor, atas nama) dan, jika diisi, gambar QRIS.
- WHEN tombol "Salin" diketuk, THE SYSTEM SHALL menyalin nomor tanpa spasi dan menampilkan "Tersalin" selama sekitar 2 detik.
- IF Clipboard API tidak tersedia, THEN THE SYSTEM SHALL memakai fallback agar nomor tetap bisa disalin.
- IF daftar rekening kosong, THEN THE SYSTEM SHALL menyembunyikan bagian amplop.

**AC8 — Motion**
- WHEN sebuah bagian masuk layar, THE SYSTEM SHALL menampilkan ornamen dan teks secara bertahap (awan bergeser dengan parallax, Wijayakusuma mekar, ombak bergerak, teks naik dan memudar).
- WHILE `prefers-reduced-motion: reduce` aktif, THE SYSTEM SHALL menonaktifkan parallax dan animasi berulang dan menampilkan semua konten tanpa menunggu animasi.
- IF GSAP gagal dimuat, THEN THE SYSTEM SHALL tetap menampilkan seluruh konten dalam keadaan terbaca.

**AC9 — Data tunggal**
- THE SYSTEM SHALL mengambil semua teks yang bisa diubah (nama, orang tua, acara, rekening, daftar foto, path musik) dari `assets/js/data.js`. Mengubah file itu cukup untuk mengganti isi undangan tanpa menyentuh HTML.

**AC10 — Tampilan dan perangkat**
- THE SYSTEM SHALL terbaca dan berfungsi pada lebar 360 px hingga desktop. Di desktop, undangan tampil sebagai kolom tengah (maksimal sekitar 480 px) dengan latar ornamen.
- THE SYSTEM SHALL tidak memuat sumber daya dari domain luar. Peta dan kalender hanya berupa tautan keluar.

## Constraints and decisions
- Confirmed: satu pasangan; HTML/CSS/JS + GSAP; aset lokal; Bahasa Indonesia; host sendiri; palet indigo, emas, krem; motif Mega Mendung + Wadasan × Wijayakusuma + ombak Teluk Penyu; motion sinematik; konten placeholder; slot musik kosong.
- Assumed: tombol kalender memakai tautan Google Calendar (bukan file .ics); nama mempelai dan orang tua tampil di bagian salam; ada bagian penutup; zona waktu WIB.
- Proposed: halaman awal (tanpa foto galeri) < 1 MB.
- Open: tidak ada yang memblokir. Data asli (nama, tanggal, lokasi, foto, rekening, musik) menyusul dari user.
