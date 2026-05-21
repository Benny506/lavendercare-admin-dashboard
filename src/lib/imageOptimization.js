/**
 * Optimizes an image file for the web by scaling it down to a max width of 800px
 * and converting it to WebP format at 85% quality.
 *
 * @param {File} file - The original image File object.
 * @returns {Promise<File>} - A Promise that resolves to the optimized File object.
 */
export async function optimizeImage(file) {
    // 1. Check if already optimized
    if (file.lcOptimized) {
        return file;
    }

    // Skip non-image files
    if (!file.type.startsWith('image/')) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // 2. Check and enforce 800px max width
                const MAX_WIDTH = 800;
                if (width > MAX_WIDTH) {
                    const ratio = MAX_WIDTH / width;
                    width = MAX_WIDTH;
                    height = height * ratio;
                }

                // 3. Draw to canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                // Ensure transparent backgrounds are handled properly (though webp supports transparency)
                ctx.drawImage(img, 0, 0, width, height);

                // 4. Convert to webp with 85% quality
                canvas.toBlob((blob) => {
                    if (!blob) {
                        return reject(new Error("Canvas to Blob conversion failed"));
                    }

                    // 5. Create new File object and attach flag
                    // We replace the original extension with .webp
                    const oldName = file.name;
                    const newName = oldName.replace(/\.[^/.]+$/, "") + ".webp";
                    
                    const optimizedFile = new File([blob], newName, {
                        type: 'image/webp',
                        lastModified: Date.now()
                    });

                    // Tag it
                    optimizedFile.lcOptimized = true;

                    resolve(optimizedFile);
                }, 'image/webp', 0.85);
            };

            img.onerror = () => reject(new Error("Failed to load image for optimization"));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}
