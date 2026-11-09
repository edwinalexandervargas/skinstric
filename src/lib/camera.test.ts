import { describe, it, expect, vi, afterEach } from 'vitest'
import { openFrontCamera, stopStream } from './camera'

describe('stopStream', () => {
  it('stops every track', () => {
    const track1 = { stop: vi.fn() }
    const track2 = { stop: vi.fn() }
    const fakeStream = { getTracks: () => [track1, track2] }

    stopStream(fakeStream as unknown as MediaStream)

    expect(track1.stop).toHaveBeenCalled()
    expect(track2.stop).toHaveBeenCalled()
  })
})

describe('openFrontCamera', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('asks for the front camera in HD with no audio and returns the stream', async () => {
    const fakeStream = { id: 'fake' }
    const getUserMedia = vi.fn().mockResolvedValue(fakeStream)

    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } })

    const result = await openFrontCamera()

    expect(getUserMedia).toHaveBeenCalledWith({
      video: {
        facingMode: 'user',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    })
    expect(result).toBe(fakeStream)
  })

  it('throws a clear error when the browser has no camera support', async () => {
    vi.stubGlobal('navigator', {})

    await expect(openFrontCamera()).rejects.toThrow('Camera is not available')
  })
})
