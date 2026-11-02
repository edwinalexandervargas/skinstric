/** Each validator returns an error message to show under the input, or null when the value is fine. */
const NAME_PATTERN = /^[\p{L} .'-]+$/u
const LOCATION_PATTERN = /^[\p{L} .,'-]+$/u

export function validateName(value: string): string | null {
  const trimmed = value.trim()
  
  if(trimmed === '') {
    return 'Please enter your name.'
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return 'Name can only contain letters, spaces, hyphens, apostrophes and periods.'
  }

  return null
}

export function validateLocation(value: string): string | null {
  const trimmed = value.trim()
  
  if (trimmed === '') {
    return 'Please enter your location'
  } 

  if (!LOCATION_PATTERN.test(trimmed)) {
    return "Location separated by comma"
  }

  return null
}
