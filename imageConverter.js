/**
 * imageConverter.js
 * Library untuk resize + convert gambar ke JPEG & WebP secara dinamis.
 * Usage:
 *   ImageConverter.convertFiles(files, options).then(results => { ... });
 */

const ImageConverter = (() => {
  /**
   * Resize image menjaga aspek rasio dan fit ke canvas target tanpa crop dan tanpa gepeng.
   * @param {HTMLImageElement} img 
   * @param {number} targetWidth 
   * @param {number} targetHeight 
   * @param {string} bgColor 
   * @returns {HTMLCanvasElement}
   */
  function resizeImageKeepAspect(img, targetWidth, targetHeight, bgColor = '#fff') {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const imgRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > targetRatio) {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2;
    } else {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgRatio;
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    return canvas;
  }

  /**
   * Konversi satu file gambar jadi JPEG dan WebP dengan resize.
   * @param {File} file 
   * @param {Object} options { width, height, jpegQuality, webpQuality, bgColor }
   * @returns {Promise<{jpeg: Blob, webp: Blob}>}
   */
  function convertFile(file, options) {
    const { width, height, jpegQuality, webpQuality, bgColor } = options;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = resizeImageKeepAspect(img, width, height, bgColor);

          canvas.toBlob(jpegBlob => {
            if (!jpegBlob) return reject(new Error('Gagal konversi JPEG'));
            canvas.toBlob(webpBlob => {
              if (!webpBlob) return reject(new Error('Gagal konversi WebP'));
              resolve({ jpeg: jpegBlob, webp: webpBlob });
            }, 'image/webp', webpQuality);
          }, 'image/jpeg', jpegQuality);
        };
        img.onerror = () => reject(new Error('Gagal load gambar'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Gagal baca file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Konversi multiple files
   * @param {FileList|File[]} files 
   * @param {Object} options { width, height, jpegQuality, webpQuality, bgColor }
   * @returns {Promise<Array<{originalName: string, jpeg: Blob, webp: Blob}>>}
   */
  async function convertFiles(files, options) {
    const results = [];
    for (const file of files) {
      try {
        const converted = await convertFile(file, options);
        results.push({ originalName: file.name, ...converted });
      } catch (err) {
        console.error(`Gagal convert file ${file.name}:`, err);
      }
    }
    return results;
  }

  return {
    convertFile,
    convertFiles,
  };
})();
