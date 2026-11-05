/** Reads a picked file into a data URL: "data:image/jpeg;base64,/9j/4AAQ...". */
export function fileToDataUrl(file: File): Promise<string> {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () =>
      reject(new Error("Couldn't read that file. Please try another."))
    reader.readAsDataURL(file)
  })
}

/**
 * Shrinks an image so its longest side is at most `maxSize` px and re-encodes it as JPEG.
 * Phone photos are 5 to 10 MB; this gets them to roughly 100 KB before they're sent.
 */
export function resizeImage(
  dataUrl: string,
  maxSize = 800,
  quality = 0.8,
): Promise<string> {
  const img = new Image()

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error("Couldn't resize the image."))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => reject(new Error("Couldn't load that image. Please try another."))
    img.src = dataUrl
  })
}

/** Grabs the current frame of a playing <video> as a JPEG data URL. */
export function captureFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth       
  canvas.height = video.videoHeight       

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error("Couldn't capture the photo.")
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', 0.8)
}

/** "data:image/jpeg;base64,AAAA" -> "AAAA". Strings without a prefix come back unchanged. */
export function stripDataUrlPrefix(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',')

  if (commaIndex === -1) {
    return dataUrl
  }

  return dataUrl.slice(commaIndex + 1)
}
