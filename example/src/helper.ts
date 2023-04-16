export const findCardNumberInArray = (arr: string[]) => {
  console.log('🚀 - arr:', arr)
  const trimmed = arr.map(replaceSpaces)
  console.log('🚀 - trimmed:', trimmed)
  const filtered = trimmed.filter((it: string) => it.length % 4 === 0)
  console.log('🚀 - filtered:', filtered)

  return filtered.find(item => item.length === 16 && hasHalfDigits(item))
}

const replaceSpaces = (str: string) => str.replaceAll(/[\s_\-—]/g, '')

function hasHalfDigits(input: string) {
  const digitRegex = /\d/g
  const digitMatches = input.match(digitRegex)
  const digitCount = digitMatches ? digitMatches.length : 0
  const halfStringLength = Math.ceil(input.length / 2)

  return digitCount >= halfStringLength
}
