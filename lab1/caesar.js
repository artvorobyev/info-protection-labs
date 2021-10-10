const prompt = require('prompt-sync')();
const ALPHABET_CAPITAL = 'АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const ALPHABET_LOWER = ALPHABET_CAPITAL.toLocaleLowerCase();

console.log('\nВведите слово:');
const word = prompt();

console.log('\nВведите сдвиг:');
const shift = parseInt(prompt());

let resultWord = '';
for (let i = 0; i < word.length; i++) {
  const realShift = shift % ALPHABET_CAPITAL.length;
  const letter = word[i];
  const isCapital = ALPHABET_CAPITAL.includes(letter);
  const letterAlphabetPosition = isCapital
    ? ALPHABET_CAPITAL.indexOf(letter)
    : ALPHABET_LOWER.indexOf(letter);
  const shiftedLetterPosition = letterAlphabetPosition + realShift;
  const resultLetter = isCapital
    ? ALPHABET_CAPITAL[shiftedLetterPosition]
    : ALPHABET_LOWER[shiftedLetterPosition];
  resultWord = `${resultWord}${resultLetter}`;
}
console.log(`\nРезультат: ${resultWord}`);
