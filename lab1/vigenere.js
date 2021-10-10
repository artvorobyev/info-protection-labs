const prompt = require('prompt-sync')();
const ALPHABET_CAPITAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

console.log('\nВведите слово:');
const word = prompt().toLocaleUpperCase();

console.log('\nВведите шифр:');
const code = prompt().toLocaleUpperCase();

let codedWord = '';
let resultWord = '';
for (let i = 0; i < word.length; i++) {
  const letter = word[i];
  const position = i % code.length;
  const codedLetter = code[position];
  console.log(`${letter} = ${codedLetter}`);
  codedWord = `${codedWord}${codedLetter}`;

  const resultLetterPosition =
    (ALPHABET_CAPITAL.indexOf(letter) + ALPHABET_CAPITAL.indexOf(codedLetter)) %
    ALPHABET_CAPITAL.length;

  const resultLetter = ALPHABET_CAPITAL[resultLetterPosition];

  resultWord = `${resultWord}${resultLetter}`;
}

console.log(`Результат: ${resultWord}`);
