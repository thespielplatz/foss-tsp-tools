const replaceCharacters = (text: string, replacement: string) => {
  return text
      .split('')
      .map(char => (char === ' ' ? char : replacement))
      .join('');
}

export default replaceCharacters