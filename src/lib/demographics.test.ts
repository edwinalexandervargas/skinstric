import { describe, expect, it } from 'vitest'
import { formatPercent, sortByConfidence, topLabel } from './demographics'
import { SAMPLE_RESULTS } from './sample'

describe('sortByConfidence', () => {
  it('puts the highest score first', () => {
    expect(sortByConfidence({ a: 0.1, b: 0.7, c: 0.2 })).toEqual([
      { label: 'b', value: 0.7 },
      { label: 'c', value: 0.2 },
      { label: 'a', value: 0.1 },
    ])
  })

  it('sorts the age buckets by score, not by age', () => {
    const labels = sortByConfidence(SAMPLE_RESULTS.age).map((row) => row.label)
    expect(labels.slice(0, 3)).toEqual(['40-49', '30-39', '50-59'])
    expect(labels.at(-1)).toBe('20-29')
  })

  it('returns an empty list for no scores', () => {
    expect(sortByConfidence({})).toEqual([])
  })

  it('does not change the object it was given', () => {
    const scores = { a: 0.1, b: 0.7 }
    sortByConfidence(scores)
    expect(Object.keys(scores)).toEqual(['a', 'b'])
  })
})

describe('formatPercent', () => {
  it.each([
    [0.2525825951799374, '25.26%'],
    [0.031678993030692736, '3.17%'],
    [0.1, '10.00%'],
    [1, '100.00%'],
    [0, '0.00%'],
  ])('%d -> %s', (value, expected) => {
    expect(formatPercent(value)).toBe(expected)
  })
})

describe('topLabel', () => {
  it("returns the A.I.'s pick", () => {
    expect(topLabel(SAMPLE_RESULTS.race)).toBe('east asian')
    expect(topLabel(SAMPLE_RESULTS.gender)).toBe('male')
  })

  it('returns an empty string when there are no scores', () => {
    expect(topLabel({})).toBe('')
  })
})
