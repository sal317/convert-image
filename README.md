Cara Pakai

<script src="path/to/imageConverter.js"></script>
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
    // hasil results berupa array objek { originalName, jpeg Blob, webp Blob }
    // bisa kamu gunakan untuk preview, upload, dll
  });
</script>
