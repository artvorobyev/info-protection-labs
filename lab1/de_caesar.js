const prompt = require('prompt-sync')();
const ALPHABET_CAPITAL = 'АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const ALPHABET_LOWER = ALPHABET_CAPITAL.toLocaleLowerCase();

console.log('\nВведите зашифрованное слово:');
const codedWord = prompt();

console.log('\nВведите сдвиг:');
const shift = parseInt(prompt());

let resultWord = '';
for (let i = 0; i < codedWord.length; i++) {
  const realShift = shift % ALPHABET_CAPITAL.length;
  const letter = codedWord[i];
  const isCapital = ALPHABET_CAPITAL.includes(letter);
  const letterAlphabetPosition = isCapital
    ? ALPHABET_CAPITAL.indexOf(letter)
    : ALPHABET_LOWER.indexOf(letter);
  const unShiftedLetterPosition = letterAlphabetPosition - realShift;
  const resultLetter = isCapital
    ? ALPHABET_CAPITAL[unShiftedLetterPosition]
    : ALPHABET_LOWER[unShiftedLetterPosition];
  resultWord = `${resultWord}${resultLetter}`;
}

console.log(`\nИсходное слово: ${resultWord}`);
