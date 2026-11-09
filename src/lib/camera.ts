export function stopStream(stream: MediaStream) {
  stream.getTracks().forEach((n) => n.stop())
}

export async function openFrontCamera() {
  if (!navigator.mediaDevices) {
    throw new Error('Camera is not available in this browser')
  }

  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: false,
  })
}
