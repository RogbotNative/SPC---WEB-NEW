/**
 * Prepares a photo for upload in the browser: fixes rotation, scales it down to at most 2400 px and saves it
 * as WebP. Phone photos (often 5–12 MB) end up a few hundred KB, and location data (EXIF/GPS) is stripped.
 */
const MAX_SIDE = 2400

export async function preparePhoto(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error(
      file.type === 'image/heic' || /\.heic$/i.test(file.name)
        ? 'iPhone HEIC photos can’t be used directly. On the iPhone, choose “Most Compatible” in Settings → Camera → Formats, or export the photo as JPG.'
        : 'Please choose a JPG, PNG or WebP photo.',
    )
  }
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('That photo couldn’t be opened. Try saving it as a JPG first.')
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Your browser couldn’t process the photo.')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const encode = (type: string, quality: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, quality))
  // Older Safari can't write WebP (it silently returns PNG), so fall back to JPEG there.
  const probe = await encode('image/webp', 0.85)
  const type = probe?.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
  for (const quality of [0.85, 0.75, 0.6]) {
    const blob = type === 'image/webp' && quality === 0.85 ? probe : await encode(type, quality)
    if (blob && blob.size < 3.8 * 1024 * 1024) return blob
  }
  throw new Error('That photo is too large even after shrinking it. Try a smaller photo.')
}
