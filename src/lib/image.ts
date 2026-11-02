import { todo } from './todo'

/** Reads a picked file into a data URL: "data:image/jpeg;base64,/9j/4AAQ...". */
export function fileToDataUrl(_file: File): Promise<string> {
  todo('fileToDataUrl (src/lib/image.ts)')
}

/**
 * Shrinks an image so its longest side is at most `maxSize` px and re-encodes it as JPEG.
 * Phone photos are 5 to 10 MB; this gets them to roughly 100 KB before they're sent.
 */
export function resizeImage(
  _dataUrl: string,
  _maxSize = 800,
  _quality = 0.8,
): Promise<string> {
  todo('resizeImage (src/lib/image.ts)')
}

/** Grabs the current frame of a playing <video> as a JPEG data URL. */
export function captureFrame(_video: HTMLVideoElement): string {
  todo('captureFrame (src/lib/image.ts)')
}

/** "data:image/jpeg;base64,AAAA" -> "AAAA". Strings without a prefix come back unchanged. */
export function stripDataUrlPrefix(dataUrl: string): string {
  return dataUrl
}
