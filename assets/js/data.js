/*
 * ==========================================================
 *  DATA UNDANGAN — satu-satunya file yang perlu Anda ubah.
 * ==========================================================
 *  - Semua isi di bawah ini masih CONTOH. Ganti dengan data asli.
 *  - Waktu ditulis dalam format "TAHUN-BULAN-TANGGALTJAM:MENIT" (waktu setempat).
 *  - Kosongkan daftar (mis. galeri: []) untuk menyembunyikan bagiannya.
 *  - Simpan file dengan encoding UTF-8.
 */
window.WEDDING = {
  mempelai: {
    pria: {
      panggilan: "Alvy",
      lengkap: "Alvy Fajri, S.Kom",
      keterangan: "Putra ketiga dari",
      ayah: "Bapak Akhmad Rosyidin",
      ibu: "Ibu Sholikah",
      asal: "Cirebon",
    },
    wanita: {
      panggilan: "Aidah",
      lengkap: "Aidah Wuryaningtyas, S.Pd",
      keterangan: "Putri ketiga dari",
      ayah: "Bapak Basuki",
      ibu: "Ibu Patrin Wuryani",
      asal: "Cilacap",
    },
  },

  // Zona waktu acara. WIB = +07:00 / Asia/Jakarta.
  zonaWaktu: { label: "WIB", offset: "+07:00", iana: "Asia/Jakarta" },

  // Tanggal yang tampil di cover.
  tanggalUtama: "2026-12-13T08:00",

  acara: [
    {
      nama: "Akad Nikah",
      mulai: "2026-12-13T08:00",
      selesai: "2026-12-13T10:00", // isi null bila ingin tampil "selesai"
      tempat: "Masjid Agung Darussalam Cilacap",
      alamat: "Jl. Masjid No.1, Sidanegara, Kec. Cilacap Tengah, Kabupaten Cilacap, Jawa Tengah",
      maps: "https://www.google.com/maps/search/?api=1&query=Masjid+Agung+Darussalam+Cilacap",
    },
    {
      nama: "Resepsi",
      mulai: "2026-12-13T11:00",
      selesai: "2026-12-13T14:00",
      tempat: "Graha Darussalam Cilacap",
      alamat: "Jl. Masjid No.1, Sidanegara, Kec. Cilacap Tengah, Kabupaten Cilacap, Jawa Tengah",
      maps: "https://www.google.com/maps/search/?api=1&query=Graha+Darussalam+Cilacap",
    },
  ],

  // Foto galeri. Taruh file di assets/img/gallery/ lalu tulis path-nya.
  galeri: [
    { src: "assets/img/gallery/contoh-1.svg", alt: "Foto prewedding 1" },
    { src: "assets/img/gallery/contoh-2.svg", alt: "Foto prewedding 2" },
    { src: "assets/img/gallery/contoh-3.svg", alt: "Foto prewedding 3" },
    { src: "assets/img/gallery/contoh-4.svg", alt: "Foto prewedding 4" },
    { src: "assets/img/gallery/contoh-5.svg", alt: "Foto prewedding 5" },
    { src: "assets/img/gallery/contoh-6.svg", alt: "Foto prewedding 6" },
  ],

  // Amplop digital. Kosongkan ([]) untuk menyembunyikan.
  amplop: [
    { bank: "BCA", nomor: "1234 5678 90", atasNama: "Raka Adiwangsa" },
    { bank: "Bank Mandiri", nomor: "1370 0012 3456 7", atasNama: "Sekar Ayu Pratiwi" },
    { bank: "DANA", nomor: "0812 3456 7890", atasNama: "Sekar Ayu Pratiwi" },
  ],
  // Gambar QRIS (opsional), mis. "assets/img/qris.png". Kosongkan "" bila tidak ada.
  qris: "",

  // Musik latar. Taruh file mp3 di assets/audio/. Kosongkan "" untuk mematikan.
  musik: "assets/audio/musik.mp3",

  teks: {
    salamPembuka: "Assalamu’alaikum Warahmatullahi Wabarakatuh",
    pengantar:
      "Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
    ayatArab:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    ayatArti:
      "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”",
    ayatSumber: "QS. Ar-Rum: 21",
    amplopPengantar:
      "Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:",
    penutup:
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    salamPenutup: "Wassalamu’alaikum Warahmatullahi Wabarakatuh",
  },
};
