export function downloadImage(
  imageUrl: string,
  filename: string = `image-${Date.now()}.png`
) {
  fetch(imageUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.error("Failed to download image:", err);
      throw new Error("Failed to download image: " + err.message);
    });
}
