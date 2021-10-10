const prompt = require('prompt-sync')();
const ALPHABET_CAPITAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

console.log('\nВведите зашифрованное слово:');
const codedWord = prompt().toLocaleUpperCase();

console.log('\nВведите шифр:');
const code = prompt().toLocaleUpperCase();

let deCodedWord = '';
let resultWord = '';
for (let i = 0; i < codedWord.length; i++) {
  const letter = codedWord[i];
  const position = i % code.length;
  const deCodedLetter = code[position];
  console.log(`${letter} = ${deCodedLetter}`);
  deCodedWord = `${codedWord}${deCodedLetter}`;

  const resultLetterPosition =
    ALPHABET_CAPITAL.indexOf(letter) - ALPHABET_CAPITAL.indexOf(deCodedLetter);
  const realPosition =
    resultLetterPosition < 0
      ? resultLetterPosition + ALPHABET_CAPITAL.length
      : resultLetterPosition;

  const resultLetter = ALPHABET_CAPITAL[realPosition];

  resultWord = `${resultWord}${resultLetter}`;
}

console.log(`Результат: ${resultWord}`);
