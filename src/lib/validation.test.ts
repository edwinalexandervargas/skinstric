import { describe, expect, it } from 'vitest'
import { validateLocation, validateName } from './validation'

describe('validateName', () => {
  it.each(['John Doe', 'Mary-Jane', "O'Brien", 'Zoë', '  Edwin  ', 'Dr. Smith'])(
    'accepts %j',
    (value) => {
      expect(validateName(value)).toBeNull()
    },
  )

  it.each(['', '   ', 'John3', '123', 'J@hn', 'John_Doe', '<script>', 'Doe, John'])(
    'rejects %j',
    (value) => {
      expect(validateName(value)).toEqual(expect.any(String))
    },
  )
})

describe('validateLocation', () => {
  it.each(['New York', 'Los Angeles, CA', 'São Paulo', 'St. Louis', "Coeur d'Alene"])(
    'accepts %j',
    (value) => {
      expect(validateLocation(value)).toBeNull()
    },
  )

  it.each(['', '   ', '90210', 'LA 2', 'Paris!', 'Tokyo#1'])('rejects %j', (value) => {
    expect(validateLocation(value)).toEqual(expect.any(String))
  })
})
