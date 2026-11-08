# Manual Book — Excel Audit Data Tools (`localhost:47136`)

Panduan lengkap instalasi, registrasi ke **Shared Folder Catalog** agar muncul di `My Add-ins`, cara memunculkan **Sidebar (Task Pane)** di semua file Excel, penggunaan harian dengan perintah `npm run`, hingga cara mengatasi kendala (*troubleshooting*).

---

## 1. Ringkasan Perintah Cepat (`npm run`)

| Perintah Terminal | Fungsi |
| :--- | :--- |
| `npm install` | Mengunduh seluruh paket/library (dijalankan **1x** di awal). |
| `npm run setup` | Menginstal sertifikat HTTPS lokal (`office-addin-dev-certs`), menyalin manifest ke Shared Folder Catalog (`C:\WordAddins` / `\\LAPTOP-7HUHP4CR\WordAddins`), & memunculkan tab **Developer** di Excel (dijalankan **1x** di awal). |
| `npm run start` | Menyalakan server `https://localhost:47136` **dan otomatis membuka Microsoft Excel**. |
| `npm run dev` | Menyalakan server `https://localhost:47136` saja (tanpa membuka jendela Excel baru). |
| **`Ctrl + C`** | Shortcut langsung di terminal aktif untuk **mematikan server** `localhost:47136`. |
| `npm run stop` | Mematikan paksa server di port `47136` dari terminal lain. |

---

## 2. Langkah Setup Pertama Kali (Hanya 1x)

Buka terminal (PowerShell / CMD / Terminal VS Code) di folder `c:\DEV\excel_audit_data_helper`, lalu jalankan 2 perintah berikut:

### Langkah 1: Install Library
```bash
npm install
```

### Langkah 2: Setup Sertifikat SSL & Registrasi ke Shared Folder Catalog
```bash
npm run setup
```
Apa yang dilakukan `npm run setup` secara otomatis?
1. Membuat dan mendaftarkan sertifikat HTTPS lokal (`office-addin-dev-certs`) untuk `https://localhost:47136`.
   > **Penting:** Jika muncul pop-up **Security Warning** dari Windows yang menanyakan *"Do you want to install this certificate?"*, klik **Yes**.
2. Menyalin [manifest/manifest.xml](./manifest/manifest.xml) secara otomatis ke folder Network Share Trusted Catalog yang sudah aktif di laptop Anda:
   - **Folder Lokal:** `C:\WordAddins\excel-audit-data-tools-manifest.xml`
   - **Trusted Catalog Address (Network Share):** `\\LAPTOP-7HUHP4CR\WordAddins` (dengan status **Show in Menu** aktif).
3. Mengaktifkan tab **Developer** pada menu bar atas Microsoft Excel agar tombol **Add-ins** selalu mudah ditemukan.

---

## 3. Cara Menjalankan Tools (`npm run start` / `npm run dev`)

Setiap kali Anda ingin menggunakan **Excel Audit Data Tools**, jalankan salah satu perintah ini di terminal:

### Opsi A: Nyalakan Server + Buka Excel Otomatis
```bash
npm run start
```
- Server lokal menyala di **`https://localhost:47136`**.
- Aplikasi **Microsoft Excel Desktop** langsung terbuka secara otomatis.

### Opsi B: Nyalakan Server Saja (Jika File Kerja Excel Sudah Terbuka)
```bash
npm run dev
```
- Server lokal menyala di **`https://localhost:47136`** tanpa membuka jendela Excel baru.

---

## 4. Cara Agar Terdaftar di `My Add-ins > SHARED FOLDER` & Trigger Sidebar-nya

Karena Microsoft Office hanya mengizinkan **1 Network Share Catalog** yang dicentang **Show in Menu**, script `npm run setup` otomatis memasukkan manifest **Excel Audit Data Tools** ke dalam catalog `\\LAPTOP-7HUHP4CR\WordAddins` (`C:\WordAddins`) milik Anda yang sudah terpercaya.

### A. Mengaktifkan dari Menu Developer > Add-ins (Hanya Perlu 1x)
1. Buka file Excel apa saja di komputer Anda.
2. Klik tab **Developer** di menu atas Excel > klik tombol **Add-ins**  
   *(atau lewat menu **Insert** > **My Add-ins**)*.
3. Pada jendela *Office Add-ins* yang muncul, klik tab **SHARED FOLDER** di bagian atas.
   *(Jika belum muncul, klik tombol **Refresh** di pojok kanan atas jendela tersebut).*
4. Anda akan melihat **Excel Audit Data Tools** terdaftar di sana -> klik **Excel Audit Data Tools** lalu klik **Add**.

*(Catatan: Jika suatu saat Anda mengecek pengaturan Trust Center di Excel secara manual melalui **File** > **Options** > **Trust Center** > **Trust Center Settings...** > **Trusted Add-in Catalogs**, alamat catalog yang digunakan adalah `\\LAPTOP-7HUHP4CR\WordAddins` dengan centang **Show in Menu** aktif).*

### B. Cara Trigger / Membuka Sidebar di Semua File Excel Selanjutnya
Begitu langkah A di atas sudah dilakukan 1 kali, Excel akan **menyematkan tombol "Excel Audit Data Tools" di tab HOME** Anda:
1. Buka **file Excel mana pun** di komputer Anda.
2. Pastikan di terminal sudah jalan `npm run dev` atau `npm run start`.
3. Lihat tab **Home** di menu atas Excel -> geser pandangan ke **pojok paling kanan** (grup **Audit Tools**).
4. Klik tombol berikon hijau **"Excel Audit Data Tools"**.
5. **Sidebar (Task Pane)** akan langsung muncul di sebelah kanan layar Excel Anda!

---

## 5. Cara Menggunakan Sidebar Excel Audit Data Tools

1. **Blok / Pilih Tabel di Excel**  
   Blok area sel tabel yang ingin diambil datanya (contoh: `A1:H25`).
2. **Baca Range**  
   Klik tombol **Read Selected Range** pada Sidebar **Excel Audit Data Tools**.
   - Akan tampil nama Sheet, alamat range (`Sheet1!A1:H25`), jumlah baris, dan jumlah kolom.
3. **Atur Opsi Parser**  
   - Centang **First row is header** jika baris pertama tabel adalah nama kolom.
   - Centang **Ignore empty rows** untuk melewati baris yang kosong.
   - Pilih struktur output JSON:
     - **Array of objects**: Setiap baris menjadi object `{ "Kolom": "Nilai" }`.
     - **Array of arrays**: Setiap baris menjadi array `["Nilai 1", "Nilai 2"]`.
4. **Cek Preview & Peringatan**  
   - Lihat hasil JSON secara langsung pada kotak **Data Preview**.
   - Jika ada nama kolom yang kosong atau kembar (duplikat), tools akan memberikan peringatan otomatis.
5. **Unduh File JSON**  
   - Klik tombol **Download JSON (.json)**.
   - File `.json` akan langsung terunduh dengan format nama otomatis (`excel-audit_<Sheet>_<Range>_<Timestamp>.json`).

---

## 6. Cara Mematikan Server (Shortcut `Ctrl + C` atau `npm run stop`)

Ada **2 cara mudah** untuk mematikan server setelah selesai bekerja:

1. **Cara 1 — Shortcut `Ctrl + C` (Paling Cepat):**  
   Pada jendela terminal tempat `npm run start` atau `npm run dev` sedang berjalan, cukup tekan tombol **`Ctrl + C`** di keyboard. Server `localhost:47136` akan langsung berhenti.
2. **Cara 2 — Perintah `npm run stop`:**  
   Jika Anda ingin mematikan server dari jendela terminal baru atau membersihkan port `47136` yang masih menyangkut, jalankan:
   ```bash
   npm run stop
   ```

---

## 7. Troubleshooting (Mengatasi Kendala Umum)

| Kendala di Excel | Penyebab | Solusi |
| :--- | :--- | :--- |
| Error `Cannot find package 'vite'` saat `npm run start` / `npm run dev` | Paket di `node_modules` belum terinstal | Jalankan `npm install` terlebih dahulu hingga selesai, baru jalankan `npm run setup` dan `npm run start`. |
| Belum terlihat di **Developer > Add-ins > SHARED FOLDER** | Manifest belum disalin ke `C:\WordAddins` atau belum di-refresh | Jalankan `npm run setup`, lalu di jendela *Office Add-ins* Excel klik tab **SHARED FOLDER** dan tekan **Refresh**. |
| Muncul pesan *"This add-in could not be started"* atau layar Sidebar putih/error | Server `https://localhost:47136` belum menyala atau sertifikat HTTPS belum disetujui | Pastikan `npm run start` / `npm run dev` sedang jalan. Jika masih gagal, jalankan ulang `npm run setup` dan klik **Yes** saat pop-up sertifikat muncul. |
| Port `47136` sedang terpakai (*Port 47136 is already in use*) | Sesi server sebelumnya belum tertutup | Tekan `Ctrl + C` di terminal sebelumnya, atau jalankan `npm run stop` lalu ulangi `npm run start`. |
| Ingin tes UI tanpa membuka Excel | Coba di browser biasa | Jalankan `npm run dev`, lalu buka `https://localhost:47136` di browser Chrome/Edge (otomatis menampilkan data simulasi). |
