# Blueprint — Excel Audit Data Tools

**Project:** Excel Audit Data Tools  
**Platform:** Microsoft Excel Office Add-in (Task Pane)  
**Local Server URL:** `https://localhost:47136`  
**Fokus Versi Pertama (v0.1):** Memilih range Excel (baris/kolom), membaca tabel, mengubahnya menjadi JSON, lalu mengunduh file JSON.

---

## 1. Tujuan Versi Pertama

Membuat Office Add-in sederhana bernama **Excel Audit Data Tools** yang berjalan langsung di dalam Microsoft Excel Desktop maupun Web.

### Alur Penggunaan:
1. Pengguna menjalankan `run-addin.bat` (otomatis menyalakan server `https://localhost:47136` dan membuka Excel).
2. Pengguna memilih range tabel secara manual di worksheet (misalnya `A1:H25`).
3. Pengguna membuka Task Pane **Excel Audit Data Tools** dari tab **Home** di Ribbon Excel.
4. Add-in membaca alamat dan isi range yang dipilih.
5. Pengguna menentukan apakah baris pertama merupakan header dan memilih struktur JSON.
6. Add-in menampilkan preview hasil parsing.
7. Pengguna mengunduh hasilnya sebagai file `.json`.

**Batasan versi pertama:** Belum ada pencocokan HPP, inventory, harga jual, normalisasi data, database, backend, atau penyimpanan permanen.

---

## 2. Konsep Penggunaan

### Alur UI

```text
run-addin.bat (Start Server https://localhost:47136 + Launch Excel)
    |
    v
Excel Workbook
    |
    | 1. User selects cells / range (e.g. A1:H25)
    v
Office Add-in Task Pane (Excel Audit Data Tools)
    |
    | 2. Click "Read Selected Range" (Office.js)
    v
Table & Range Info + Parser Options
    |
    | 3. Configure Header & JSON Format
    v
Live JSON Preview
    |
    | 4. Click "Download JSON"
    v
Download .json file
```

### Contoh Interaksi
- Pengguna memilih sel `A1:H25` di Excel.
- Pengguna menekan tombol **Read Selected Range**.
- Add-in menampilkan alamat range: `Sheet1!A1:H25` beserta dimensi (`25 rows × 8 columns`).
- Pengguna mengaktifkan opsi **First row is header**.
- Add-in menampilkan preview JSON secara langsung.
- Pengguna menekan **Download JSON**.

---

## 3. Struktur Folder Project

Menggunakan arsitektur modular berbasis **React + TypeScript + Vite + Office.js** yang dilengkapi script `.bat` untuk otomatisasi setup dan eksekusi di Windows:

```text
excel_audit_data_helper/
├── public/
│   └── assets/
│       ├── icon-16.png
│       ├── icon-32.png
│       └── icon-80.png
│
├── manifest/
│   └── manifest.xml              # Konfigurasi Add-in (mengarah ke https://localhost:47136)
│
├── src/
│   ├── taskpane/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── RangeInfo.tsx
│   │   │   ├── ParserOptions.tsx
│   │   │   ├── DataPreview.tsx
│   │   │   └── DownloadButton.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── office/
│   │   ├── excelReader.ts        # Pembacaan range via Excel.run (Office.js)
│   │   └── officeTypes.ts
│   │
│   ├── parser/
│   │   ├── tableParser.ts        # Konversi array 2D Excel ke struktur JSON
│   │   ├── jsonBuilder.ts        # Pembungkus metadata + data
│   │   └── parserTypes.ts
│   │
│   ├── utils/
│   │   ├── downloadJson.ts       # Trigger download Blob .json
│   │   └── fileName.ts           # Generator nama file otomatis
│   │
│   └── styles/
│       └── globals.css           # Styling Tailwind CSS
│
├── index.html                    # Entry HTML Vite (memuat Office.js CDN + main.tsx)
├── setup-addin.bat               # 1-Click install dependency, SSL cert, & register Add-in
├── run-addin.bat                 # 1-Click jalankan localhost:47136 & buka Excel otomatis
├── stop-addin.bat                # 1-Click hentikan server & sesi debugging Excel
├── package.json
├── tsconfig.json
├── vite.config.ts                # Konfigurasi port 47136 + HTTPS dev-certs
├── Blueprint.md                  # Dokumen arsitektur & spesifikasi ini
└── manual book.md                # Panduan instalasi, penggunaan, dan troubleshooting
```

### Tanggung Jawab Folder & File Utama

| Folder / File | Tanggung Jawab |
| :--- | :--- |
| `manifest/manifest.xml` | Konfigurasi ID Add-in, nama **Excel Audit Data Tools**, tombol Ribbon, dan URL `https://localhost:47136` |
| `setup-addin.bat` | Menginstal package npm, sertifikat HTTPS lokal (`office-addin-dev-certs`), dan mendaftarkan manifest |
| `run-addin.bat` | Menjalankan dev server di `https://localhost:47136` dan langsung melakukan sideload ke Excel Desktop |
| `stop-addin.bat` | Menghentikan proses server dan membersihkan sesi debugging add-in |
| `src/taskpane/` | Komponen UI React yang tampil di panel kanan (Task Pane) Excel |
| `src/office/` | Komunikasi dengan workbook Excel menggunakan `Office.js` |
| `src/parser/` | Logika transformasi matriks sel Excel menjadi Array of Objects / Array of Arrays |
| `src/utils/` | Utilitas pengunduhan file `.json` dan format penamaan file |
| `public/assets/` | Icon add-in (`16x16`, `32x32`, `80x80`) untuk tampilan di Ribbon Excel |

---

## 4. Rancangan Tampilan Task Pane

Nama Add-in di Ribbon & Header: **Excel Audit Data Tools**

```text
┌──────────────────────────────────┐
│ EXCEL AUDIT DATA TOOLS           │
│ Excel Data → JSON Exporter       │
├──────────────────────────────────┤
│ SELECTED RANGE                   │
│                                  │
│ Sheet1!A1:H25                    │
│ 25 rows × 8 columns              │
│                                  │
│ [ Read Selected Range ]          │
├──────────────────────────────────┤
│ PARSER OPTIONS                   │
│                                  │
│ [✓] First row is header          │
│ [✓] Ignore empty rows            │
│                                  │
│ JSON structure:                  │
│ (•) Array of objects             │
│ ( ) Array of arrays              │
├──────────────────────────────────┤
│ DATA PREVIEW (24 items)          │
│                                  │
│ {                                │
│   "Nama Barang": "ABON 500 gr",  │
│   "QTY": 7,                      │
│   "Unit": "PCK",                 │
│   "Price": 72500                 │
│ }                                │
│                                  │
│ [ Refresh Preview ]              │
│ [ Download JSON ]                │
└──────────────────────────────────┘
```

---

## 5. Perilaku Parser

### 5.1 Membaca Range Excel (`excelReader.ts`)
- Mengambil worksheet aktif dan range yang sedang diblok/dipilih (`context.workbook.getSelectedRange()`).
- Memuat properti `address`, `rowCount`, `columnCount`, `values`, dan `worksheet.name`.
- Pembacaan dipicu saat pengguna menekan tombol **Read Selected Range** atau **Refresh Preview**.

### 5.2 Opsi Struktur JSON

**A. Array of Objects (Default)**  
Menggunakan baris pertama sebagai key objek:
```json
[
  {
    "Nama Barang": "ABON 500 gr",
    "QTY": 7,
    "Unit": "PCK",
    "Price": 72500,
    "Subtotal": 507500
  },
  {
    "Nama Barang": "BANANA SYRUP",
    "QTY": 4,
    "Unit": "BOTOL",
    "Price": 100000,
    "Subtotal": 400000
  }
]
```

**B. Array of Arrays**  
Mempertahankan susunan baris dan kolom apa adanya:
```json
[
  ["Nama Barang", "QTY", "Unit", "Price", "Subtotal"],
  ["ABON 500 gr", 7, "PCK", 72500, 507500],
  ["BANANA SYRUP", 4, "BOTOL", 100000, 400000]
]
```

### 5.3 Aturan Parsing
- **Tipe Data Asli:** Pertahankan nilai teks, angka, dan boolean sebagaimana dibaca dari `range.values` (hasil perhitungan rumus/formula yang tampil di Excel).
- **Tanpa Modifikasi Nilai:** Jangan mengubah nama barang, satuan, atau harga secara otomatis.
- **Baris Kosong:** Baris yang seluruh selnya kosong (`""` atau `null`) diabaikan secara default (dapat diatur lewat checkbox *Ignore empty rows*).
- **Sel Kosong:** Sel kosong di tengah data direpresentasikan secara konsisten sebagai `null`.
- **Header Kosong / Duplikat:**
  - Jika ada kolom dengan header kosong, gunakan fallback `Column_1`, `Column_2`, dst. serta tampilkan badge peringatan di UI.
  - Jika ada header duplikat (misal `Price` muncul 2 kali), beri sufiks `Price_2` dan tampilkan peringatan di UI.

---

## 6. Bentuk JSON yang Direkomendasikan

File JSON yang diunduh membungkus `metadata` asal data dan array `data`:

```json
{
  "metadata": {
    "tool": "Excel Audit Data Tools",
    "version": "0.1.0",
    "sourceSheet": "Sheet1",
    "sourceRange": "A1:E3",
    "rowCount": 3,
    "columnCount": 5,
    "exportedAt": "2026-11-08T12:00:00.000Z",
    "hasHeader": true,
    "format": "array-of-objects"
  },
  "data": [
    {
      "Nama Barang": "ABON 500 gr",
      "QTY": 7,
      "Unit": "PCK",
      "Price": 72500,
      "Subtotal": 507500
    }
  ]
}
```

---

## 7. Modul dan Kontrak Fungsi

| Modul | Fungsi Utama |
| :--- | :--- |
| `excelReader.ts` | `readSelectedRange(): Promise<SelectedRangeData>` |
| `tableParser.ts` | `parseTable(values, options): ParsedTableResult` |
| `jsonBuilder.ts` | `buildExportPayload(parsed, rangeData, options): ExportPayload` |
| `downloadJson.ts` | `downloadJsonFile(payload, filename): void` |
| `fileName.ts` | `createExportFilename(sheetName): string` |

### Kontrak Tipe Data (`ts`)

```ts
export type ParserFormat = "objects" | "arrays";

export interface ParserOptions {
  hasHeader: boolean;
  format: ParserFormat;
  ignoreEmptyRows: boolean;
}

export interface SelectedRangeData {
  sheetName: string;
  address: string;
  rowCount: number;
  columnCount: number;
  values: (string | number | boolean | null)[][];
}

export interface ParsedTableResult {
  data: Record<string, unknown>[] | unknown[][];
  warnings: string[];
  exportedRowCount: number;
}
```

---

## 8. Konfigurasi Server, Port `47136`, & Perintah `npm run`

Office Add-in di Microsoft Excel mewajibkan koneksi **HTTPS** meskipun berjalan di `localhost`.

### 8.1 Spesifikasi Port & HTTPS (`vite.config.ts`)
- **Host:** `localhost`
- **Port:** `47136` (`strictPort: true` agar port tidak berubah secara acak)
- **HTTPS:** Menggunakan sertifikat dari `office-addin-dev-certs` (`~/.office-addin-dev-certs/localhost.crt` & `localhost.key`).
- **URL Task Pane di `manifest.xml`:** `https://localhost:47136/index.html`

### 8.2 Daftar Perintah `npm run` (`package.json` & `scripts/`)

1. **`npm run setup` (`scripts/setup.mjs` — Dijalankan 1x saat awal setelah `npm install`)**
   - Menjalankan `npx office-addin-dev-certs install` untuk mendaftarkan sertifikat SSL lokal ke Trusted Root Windows.
   - Mendaftarkan lokasi `manifest\manifest.xml` ke Registry Developer Add-in Excel (`HKCU\Software\Microsoft\Office\16.0\WEF\Developer`) sehingga langsung dikenali Excel.

2. **`npm run start` (`scripts/start.mjs` — Menjalankan server + buka Excel)**
   - Memastikan manifest terdaftar di Registry Excel, membuka aplikasi Microsoft Excel Desktop secara otomatis, dan menyalakan server Vite di `https://localhost:47136` pada terminal aktif.

3. **`npm run dev` (`scripts/start.mjs --no-excel` — Menjalankan server saja)**
   - Menyalakan server Vite di `https://localhost:47136` tanpa membuka jendela Excel baru (cocok jika Excel sudah terbuka).

4. **Mematikan Server: Shortcut `Ctrl + C` atau `npm run stop` (`scripts/stop.mjs`)**
   - **`Ctrl + C`:** Tekan langsung di terminal tempat `npm run start` / `npm run dev` berjalan untuk langsung mematikan server `localhost:47136`.
   - **`npm run stop`:** Mematikan paksa proses yang berjalan di port `47136` jika dijalankan dari terminal terpisah.

---

## 9. Batasan Scope Versi 0.1

### Termasuk
- Office Add-in Excel Task Pane bernama **Excel Audit Data Tools**.
- Berjalan di `https://localhost:47136` dengan launcher `.bat` otomatis.
- Membaca selected range aktif di Excel.
- Menampilkan nama sheet, alamat range, jumlah baris, dan jumlah kolom.
- Opsi baris pertama sebagai header & abaikan baris kosong.
- Pilihan format JSON: *Array of Objects* dan *Array of Arrays*.
- Peringatan otomatis jika ada header kosong atau duplikat.
- Preview JSON interaktif di Task Pane.
- Unduh file `.json` dengan penamaan otomatis (`excel-audit_<SheetName>_<Timestamp>.json`).

### Belum Termasuk
- Import beberapa sumber sekaligus.
- Penyimpanan project permanen / IndexedDB / backend.
- Normalisasi data & fuzzy matching nama barang.
- Perhitungan selisih harga & audit HPP.
- Generate laporan kembali ke sheet Excel.

---

## 10. Step-by-Step Urutan Implementasi

Berikut adalah urutan langkah pembangunan project dari awal hingga siap digunakan:

### Tahap 1 — Inisialisasi Project & Konfigurasi Server (`localhost:47136`)
1. Buat `package.json` dengan dependencies React, TypeScript, Tailwind CSS, Vite, `@types/office-js`, `office-addin-dev-certs`, dan `office-addin-debugging`.
2. Konfigurasikan `vite.config.ts` untuk membaca sertifikat HTTPS dari `office-addin-dev-certs` dan mengunci port di `47136`.
3. Buat `index.html` di root yang memuat script `<script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>`.

### Tahap 2 — Pembuatan Manifest & Icon Add-in
4. Buat icon add-in di `public/assets/` (`icon-16.png`, `icon-32.png`, `icon-80.png`).
5. Buat `manifest/manifest.xml` dengan `DisplayName` **"Excel Audit Data Tools"** dan semua endpoint URL mengarah ke `https://localhost:47136`.

### Tahap 3 — Pembuatan Modul Core (Office.js & Parser)
6. Buat `src/office/officeTypes.ts` dan `src/office/excelReader.ts` untuk membaca range terpilih di Excel.
7. Buat `src/parser/parserTypes.ts`, `src/parser/tableParser.ts`, dan `src/parser/jsonBuilder.ts` untuk memproses array 2D menjadi JSON beserta deteksi header kosong/duplikat.
8. Buat `src/utils/fileName.ts` dan `src/utils/downloadJson.ts` untuk mengunduh hasil JSON.

### Tahap 4 — Pembuatan UI Task Pane
9. Buat komponen UI di `src/taskpane/components/` (`Header`, `RangeInfo`, `ParserOptions`, `DataPreview`, `DownloadButton`).
10. Rakit seluruh alur state di `src/taskpane/App.tsx` dan inisialisasi `Office.onReady()` di `src/taskpane/main.tsx`.

### Tahap 5 — Pembuatan Script Otomatisasi (`.bat`) & Pengujian
11. Buat `setup-addin.bat`, `run-addin.bat`, dan `stop-addin.bat`.
12. Jalankan `setup-addin.bat` lalu `run-addin.bat` untuk menguji buka langsung di Microsoft Excel.

---

## 11. Prompt Eksekusi (1-Prompt Setup)

Ketika Anda siap untuk menginstal dan membuat seluruh kode project, cukup kirimkan prompt berikut:

> **"Tolong bangun seluruh project Excel Audit Data Tools sekarang sesuai `Blueprint.md` (port `https://localhost:47136`, lengkap dengan `manifest.xml`, komponen React, Office.js reader, JSON parser, serta file `setup-addin.bat`, `run-addin.bat`, dan `stop-addin.bat`)."**
