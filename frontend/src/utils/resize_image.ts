import Toaster from './toaster';

export const resizeImage = async (file: File, width: number, height: number, maxSize?: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const MAX_SIZE = maxSize ? maxSize : 5;
    try {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // Calculate the aspect ratio of the original image
        const originalAspectRatio = img.width / img.height;
        const cropAspectRatio = width / height;

        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;

        if (originalAspectRatio > cropAspectRatio) {
          // Original image is wider, crop the sides
          sw = img.height * cropAspectRatio;
          sx = (img.width - sw) / 2;
        } else {
          // Original image is taller, crop the top and bottom
          sh = img.width / cropAspectRatio;
          sy = (img.height - sh) / 2;
        }

        ctx?.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

        canvas.toBlob(
          async croppedBlob => {
            if (croppedBlob) {
              // Create a File object with the cropped blob
              const fileName = file.name;
              const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });

              // Calculate the size of the resized image
              const size = await calculateFileSize(canvas.toDataURL('image/jpeg'));
              if (size > MAX_SIZE) {
                Toaster.error('Image Too Large');
                return;
              }

              resolve(croppedFile);
            } else {
              reject(new Error('Failed to crop the image.'));
            }
          },
          'image/jpeg',
          1 // JPEG quality (0-1)
        );
      };

      img.onerror = error => {
        console.log(error);
        reject(new Error('Failed to load the image.'));
      };

      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.log(err);
      reject(new Error('Error in Cropping: ' + err));
    }
  });
};

const calculateFileSize = async (dataURL: string): Promise<number> => {
  // Convert the data URL to a Blob
  const blob = await (await fetch(dataURL)).blob();

  // Calculate the size of the Blob in MB
  return blob.size / (1024 * 1024);
};
