/** "east asian" -> "East Asian". Display only; the store keeps the API's own labels. */
export function titleCase(label: string): string {
  return label.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
}
