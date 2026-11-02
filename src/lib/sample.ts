import type { Demographics } from './types'

/** The example response from the requirements PDF. Used by the dev-only "load sample results" button. */
export const SAMPLE_RESULTS: Demographics = {
  race: {
    black: 0.11956584717786628,
    white: 0.1280179046276461,
    'southeast asian': 0.06297961651829671,
    'south asian': 0.1425984353728242,
    'latino hispanic': 0.0619650872094126,
    'east asian': 0.2525825951799374,
    'middle eastern': 0.23229411391401664,
  },
  age: {
    '20-29': 0.031678993030692736,
    '30-39': 0.14951751927400894,
    '40-49': 0.21423285073736906,
    '10-19': 0.060884420054723574,
    '50-59': 0.14185781411091578,
    '3-9': 0.11754071465957916,
    '60-69': 0.0640062076182385,
    '70+': 0.10014548458462194,
    '0-2': 0.12013599592985022,
  },
  gender: {
    male: 0.520499217733165,
    female: 0.47950078226683496,
  },
}
