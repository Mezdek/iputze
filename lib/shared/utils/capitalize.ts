export function capitalize(
  str: string | undefined,
  separator: string = ' ',
  option: 'ALL_WORDS' | 'FIRST_WORD_ONLY' = 'FIRST_WORD_ONLY',
  fallBackString: string = ''
) {
  if (!str) return fallBackString;
  let resultArray = [];
  const stringArray = str.split(separator);
  if (option === 'FIRST_WORD_ONLY') {
    const firstWord =
      stringArray[0].charAt(0).toUpperCase() +
      stringArray[0].slice(1).toLowerCase();
    stringArray.shift();
    const rest = stringArray.map((word) => word.toLowerCase());
    resultArray = [firstWord, ...rest];
  } else {
    if (option && option !== 'ALL_WORDS') {
      console.warn(
        'Wrong option used; please use one of the following: ALL_WORDS, FIRST_WORD_ONLY'
      );
    }
    resultArray = stringArray.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }
  return resultArray.join(' ');
}
