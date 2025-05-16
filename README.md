# Cara Pakai imageConverter.js

---

### 1. Tambahkan script library `imageConverter.js` di halaman HTML kamu

Jika kamu menggunakan CDN jsDelivr, contoh:

```html
<script src="https://cdn.jsdelivr.net/gh/sal317/convert-image@main/imageConverter.js"></script>
<script>
  const inputFiles = document.getElementById('fileInput');

  inputFiles.addEventListener('change', async () => {
    const files = inputFiles.files;

    const options = {
      width: 800,
      height: 600,
      jpegQuality: 0.85,
      webpQuality: 0.8,
      bgColor: '#fff', // optional, default putih
    };

    const results = await ImageConverter.convertFiles(files, options);

    console.log(results);
    // Hasil berupa array objek dengan properti:
    // { originalName, jpeg: Blob, webp: Blob }
    // Bisa digunakan untuk preview, upload, dsb.
  });
</script>
