import { afterEach, describe, expect, it, vi } from 'vitest'
import { analyzeImage, PHASE_ONE_URL, PHASE_TWO_URL, submitIntro } from './api'
import { SAMPLE_RESULTS } from './sample'

/** Replaces the global fetch with a fake that answers `body` with the given status. */
function fakeFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** The URL and parsed JSON body of the first fetch call. */
function firstCall(fetchMock: ReturnType<typeof fakeFetch>) {
  const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
  return { url, init, body: JSON.parse(String(init.body)) as unknown }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('submitIntro', () => {
  it('POSTs name and location as JSON to Phase 1', async () => {
    const fetchMock = fakeFetch({ SUCCUSS: 'Added Edwin from Los Angeles' })
    await submitIntro('Edwin', 'Los Angeles')

    const { url, init, body } = firstCall(fetchMock)
    expect(url).toBe(PHASE_ONE_URL)
    expect(init.method).toBe('POST')
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json')
    expect(body).toEqual({ name: 'Edwin', location: 'Los Angeles' })
  })

  it('throws when the server answers with an error', async () => {
    fakeFetch({ error: 'nope' }, 500)
    await expect(submitIntro('Edwin', 'Los Angeles')).rejects.toThrow()
  })
})

describe('analyzeImage', () => {
  const dataUrl = 'data:image/jpeg;base64,/9j/4AAQ'

  it('POSTs the image to Phase 2 and returns the data part', async () => {
    const fetchMock = fakeFetch({ message: 'SUCCESS', data: SAMPLE_RESULTS })
    const result = await analyzeImage(dataUrl)

    const { url, init, body } = firstCall(fetchMock)
    expect(url).toBe(PHASE_TWO_URL)
    expect(init.method).toBe('POST')
    // Matches the PDF: key "Image", plain base64.
    expect(body).toEqual({ image: '/9j/4AAQ' })
    expect(result).toEqual(SAMPLE_RESULTS)
  })

  it('throws when the server answers with an error', async () => {
    fakeFetch({ error: 'bad image' }, 400)
    await expect(analyzeImage(dataUrl)).rejects.toThrow()
  })
})
