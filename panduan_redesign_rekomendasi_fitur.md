# Rencana Redesign UI & Peningkatan Fitur MuslimIN (Ramadhan Countdown)

Dokumen ini berisi audit antarmuka saat ini, strategi perbaikan visual agar terlepas dari kesan **"AI Slop"** (desain generik bot/template), sistem desain modern, serta rekomendasi fitur baru yang relevan bagi pengguna Muslim menyambut dan menjalani Ramadhan.

---

## 1. Masalah Utama yang Membuat Tampilan Terasa "AI Slop"

Istilah *AI Slop* pada antarmuka web biasanya merujuk pada tata letak yang dihasilkan secara cepat tanpa hirarki visual matang, menggunakan visual klise berulang, dan minim sentuhan identitas produk:

1. **Aset Gambar Mengambang Tanpa Konteks (Clip-art Clutter)**
   - Saat ini halaman dipenuhi file aset terpisah (`lantern.png`, `ketupat.png`, `oil-lamp.png`, `mosque-silhouette.jpg`) yang disebar acak di sekitar kartu. Ini tanda paling kentara dari template AI cepat saji.
2. **Inkonsistensi Bahasa (Campur Aduk ID & EN)**
   - Ada "Countdown to Ramadan" lalu "Waktu Sholat Hari Ini", "Hadith of the Day" lalu "Memuat Hadits...". Ketidakkonsistenan ini merusak polesan profesionalitas aplikasi.
3. **Card-in-Card Syndrome & Gradient Gelap Generik**
   - Latar belakang ungu/biru gelap malam bertabur bintang dengan kartu transparan ber-border tipis (klise template AI 2023–2025).
4. **Detail Teknis Bocor ke UI Publik**
   - Menampilkan teks mentah seperti: `"Data Sholat untuk tanggal 2026-01-15 | Sumber API Kota: https://raw.githubusercontent.com/..."` langsung di area utama antarmuka. Ini mengesankan proyek mentah/skrip uji coba.
5. **Section Kosong**
   - Adanya section *"Coming Soon - This feature is under development"* tanpa ilustrasi atau kejelasan fungsi.

---

## 2. Arah Baru: Desain Bersih, Elegan, dan Berkarakter

Ubah estetika dari sekadar "kartu gelap bertabur clip-art" menjadi **Editorial Islami Modern** atau **Minimalist Dashboard Companion**.

### A. Palet Warna (Pilih salah satu)
* **Pilihan 1 — Warm Oasis (Modern & Hangat):**
  - Background Utama: `#FBF9F4` (Light cream/ivory) atau `#0F1715` (Deep emerald dark mode).
  - Aksen Primer: `#1B4D3E` (Deep Forest / Pine Green).
  - Aksen Sekunder: `#C5A059` atau `#D4AF37` (Muted Warm Gold, bukan kuning neon).
  - Teks: `#1E293B` (Slate) / `#F1F5F9`.
* **Pilihan 2 — Midnight Sky (Elegan & Intim):**
  - Background: `#0B0F19` (Bukan ungu pekat, melainkan slate night).
  - Kartu & Kontainer: `#111827` dengan border tipis `#1F2937`.
  - Aksen: Sand Gold `#E2C485` dan Teal `#0D9488`.

### B. Tipografi
Hindari font default sans-serif biasa (`Inter` tanpa variasi bobot atau `Comic/Decorative` acak).
- **Heading:** Serif anggun dengan karakter kuat seperti `Playfair Display`, `Cinzel`, atau `Plus Jakarta Sans` dengan styling tracking longgar.
- **Angka Countdown:** Monospace elegan seperti `JetBrains Mono` atau angka serif tabular (`tabular-nums`) agar tidak bergoyang saat detik berganti.
- **Teks Arab:** Gunakan font kaligrafi web khusus seperti `Amiri` atau `Scheherazade New` dengan *line-height* yang lega ($1.8$ - $2.0$).

### C. Ganti Clip-art dengan Pola Geometris Minimalis
- Hapus semua PNG bertumpuk (lentera, ketupat potong resolusi rendah).
- Ganti dengan **subtle SVG Islamic geometric pattern** (misalnya pola 8-point star / Girih) dengan opacity rendah (3%–6%) sebagai tekstur latar atau watermark kartu.
- Jadikan ilustrasi fungsional: jika ada fase bulan, gunakan visual **fase bulan live** (Hilal dinamis) alih-alih stiker bulan sabit kartun.

---

## 3. Rombakan Struktur Komponen Antarmuka

### 1. Hero Section & Countdown Ramadhan
- **Sebelum:** Teks sederhana dengan 4 kotak countdown dan gambar lentera mengambang.
- **Sesudah:**
  - Jadikan **Visual Focal Point**. Hitung mundur Ramadhan berada di tengah dengan ukuran angka besar dan bersih.
  - Tampilkan label estimasi tanggal: `"1 Ramadhan 1447 H • Estimasi Rabu, 18 Februari 2026"`.
  - Berikan toggle switch kecil: *"Metode: Kemenag RI (MABIMS) / Muhammadiyah (Hisab)"* untuk memberikan nilai edukatif dan transparansi akurasi.

### 2. Jadwal Sholat Terintegrasi
- **Sebelum:** Dropdown mentah yang memuat URL github mentah di layar.
- **Sesudah:**
  - Auto-detect lokasi via Geolocation API browser dengan opsi fallback manual pencarian kota berbasis autocomplete/combobox.
  - **Highlight Jadwal Aktif:** Berikan kartu sorotan untuk waktu sholat berikutnya (misalnya: *“Menuju Maghrib (Buka Puasa): 01 jam 24 menit lagi”*).
  - Tampilkan Imsak dan Terbit secara jelas, bukan hanya 5 waktu fardhu.

### 3. Kutipan Hadits Harian Berkelas
- **Sebelum:** Kotak teks "Memuat hadits...".
- **Sesudah:**
  - Layout kartu kutipan dengan ikon petik halus.
  - Tampilkan teks Arab berharakat, terjemahan bahasa Indonesia, dan takhrij/perawi (HR. Bukhari, Muslim, dsb.).
  - Tombol aksi mikro: *"Salin Kutipan"* dan *"Bagikan ke WhatsApp/Story"*.

---

## 4. Rekomendasi Fitur Tambahan (High-Value Features)

Agar aplikasi tidak sekadar dibuka sekali lalu ditinggalkan, tambahkan fitur yang memiliki retensi harian tinggi:

1. **Countdown Imsak & Maghrib (Imsakiyah Mode)**
   - Saat Ramadhan tiba, otomatis alihkan fokus hitung mundur dari "Menuju Ramadhan" menjadi **"Hitung Mundur Buka Puasa (Maghrib)"** dan **"Hitung Mundur Imsak (Sahur)"**.
2. **Download / Cetak Jadwal Imsakiyah 30 Hari (PDF & Image)**
   - Fitur membuat jadwal Imsakiyah sebulan penuh per kota yang bisa di-unduh atau disimpan sebagai gambar story ponsel. Fitur ini sangat viral menjelang hari pertama puasa.
3. **Ramadhan Target Tracker (Penyimpanan Lokal / LocalStorage)**
   - Check-list amalan harian personal tanpa perlu login:
     - [ ] Target Tilawah (Juz / Lembar)
     - [ ] Sholat Tarawih & Witir
     - [ ] Sedekah Subuh
4. **Alarm Adzan & Pengingat Imsak / Sahur (Web Audio & Push Notification)**
   - Pengingat suara lembut (suara bedug/beep/adzan) 10 menit sebelum waktu Imsak atau adzan Maghrib saat tab browser terbuka.
5. **Mode Suara / Audio Murottal & Doa Harian**
   - Widget mini pemutar doa harian Ramadhan (Doa buka puasa, niat puasa, doa lailatul qadar) beserta audio pelafalan pendek.

---

## 5. Mockup Hirarki Halaman Baru (Wireframe Konseptual)

```text
+-------------------------------------------------------------------+
|  [Logo] MuslimIN                     [Tema Terang/Gelap] [Kota: ID] |
+-------------------------------------------------------------------+
|                                                                   |
|                   MENUJU RAMADHAN 1447 H                          |
|                                                                   |
|            [ 33 ]   :   [ 07 ]   :   [ 37 ]   :   [ 04 ]          |
|             HARI         JAM         MENIT        DETIK           |
|                                                                   |
|          Estimasi 1 Ramadhan: 18 Februari 2026 (Hisab)            |
|          [ Simpan ke Google Calendar ]  [ Unduh Imsakiyah ]        |
|                                                                   |
+-------------------------------------------------------------------+
|                                                                   |
|  JADWAL HARI INI (Semarang, Jawa Tengah)   [Ubah Lokasi]          |
|  +-------------------------------------------------------------+  |
|  | Imsak    Subuh    Terbit    Dzuhur    Ashar    *MAGHRIB*  Isya  |  |
|  | 04:12    04:22    05:40     11:58     15:20    *18:14*    19:28 |  |
|  +-------------------------------------------------------------+  |
|  Status: 02 jam 14 menit menuju Maghrib                           |
|                                                                   |
+-------------------------------------------------------------------+
|                                                                   |
|  MUTIARA HADITS HARI INI                                          |
|  "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ"      |
|  "Barangsiapa berpuasa Ramadhan karena iman dan mengharap pahala, |
|   maka diampuni dosa-dosanya yang telah lalu." (HR. Bukhari)      |
|  [ Salin Teks ]  [ Bagikan ]                                      |
|                                                                   |
+-------------------------------------------------------------------+
|  Footer: Dibuat dengan niat ibadah. Sumber data: Kemenag / API.    |
+-------------------------------------------------------------------+
```