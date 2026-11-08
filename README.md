# Excel Audit Data Tools

Microsoft Excel Office Add-in (Task Pane) untuk memilih range tabel di Excel, melakukan preview hasil parsing, dan mengunduhnya sebagai file `.json`.

- **Local Server:** `https://localhost:47136`
- **Arsitektur & Spesifikasi:** Lihat [Blueprint.md](./Blueprint.md)
- **Panduan Setup & Penggunaan Lengkap:** Lihat [manual book.md](./manual%20book.md)

## Perintah `npm run`

```bash
# 1. Install paket (1x di awal)
npm install

# 2. Install sertifikat HTTPS lokal & daftarkan manifest ke Excel (1x di awal)
npm run setup

# 3. Jalankan server https://localhost:47136 & buka Excel otomatis
npm run start

# 4. Jalankan server saja (tanpa membuka Excel baru)
npm run dev

# 5. Matikan server:
#    Cukup tekan [Ctrl + C] di terminal aktif, atau jalankan:
npm run stop
```
