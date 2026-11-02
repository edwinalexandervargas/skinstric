import { describe, expect, it } from 'vitest'
import { stripDataUrlPrefix } from './image'

describe('stripDataUrlPrefix', () => {
  it('removes the data URL prefix', () => {
    expect(stripDataUrlPrefix('data:image/jpeg;base64,/9j/4AAQ')).toBe('/9j/4AAQ')
    expect(stripDataUrlPrefix('data:image/png;base64,iVBORw0')).toBe('iVBORw0')
  })

  it('leaves plain base64 alone', () => {
    expect(stripDataUrlPrefix('iVBORw0')).toBe('iVBORw0')
  })
})
