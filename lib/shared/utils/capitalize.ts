export function capitalize(
  str: string | undefined,
  separator: string = ' ',
  option: 'ALL_WORDS' | 'FIRST_WORD_ONLY' = 'FIRST_WORD_ONLY',
  fallBackString: string = ''
) {
  if (!str) return fallBackString;

  const stringArray = str.split(separator);
  if (stringArray.length === 0 || !stringArray[0]) return fallBackString;

  let resultArray: string[];

  if (option === 'FIRST_WORD_ONLY') {
    const firstWord =
      stringArray[0].charAt(0).toUpperCase() +
      stringArray[0].slice(1).toLowerCase();
    const rest = stringArray.slice(1).map((word) => word.toLowerCase());
    resultArray = [firstWord, ...rest];
  } else {
    resultArray = stringArray.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }

  return resultArray.join(' ');
}
