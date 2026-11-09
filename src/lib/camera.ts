export function stopStream(stream: MediaStream) {
   stream.getTracks().forEach((n) => n.stop())
}

export async function openFrontCamera() {
  if (!navigator.mediaDevices) {
    throw new Error('Camera is not available in this browser')
  }

  return navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' },
    audio: false,
  })


}