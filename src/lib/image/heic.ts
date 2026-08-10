

export async function convertHeicToPng(file: File): Promise<File> {
  if (
    file.type === "image/heic" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  ) {
    try {
      const heic2any = (await import("heic2any")).default;
      const blob = await heic2any({
        blob: file,
        toType: "image/png",
        quality: 1,
      });

      const resultBlob = Array.isArray(blob) ? blob[0] : blob;
      return new File([resultBlob], file.name.replace(/\.hei[cf]$/i, ".png"), {
        type: "image/png",
      });
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      throw new Error("This photo format couldn't be processed. Try uploading a JPG or PNG.");
    }
  }
  return file;
}
