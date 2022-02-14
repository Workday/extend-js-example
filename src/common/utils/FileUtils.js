export const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener('load', function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
};